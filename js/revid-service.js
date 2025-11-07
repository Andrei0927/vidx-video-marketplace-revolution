/**
 * Revid.ai API Service
 * 
 * API Documentation: https://documenter.getpostman.com/view/36975521/2sA3kPo4BR
 * 
 * This service handles:
 * - Script generation from item descriptions
 * - AI video generation with TTS, images/videos, and captions
 * - Video status checking and downloading
 */

class RevidService {
    constructor() {
        // API Configuration
        this.apiKey = 'YOUR_REVID_API_KEY'; // Replace with actual API key
        this.baseUrl = 'https://api.revid.ai/v1'; // Standard REST API pattern
        
        // Voice configuration - using one consistent voice for brand familiarity
        this.defaultVoice = 'emma'; // Professional, clear voice (like TikTok's signature voice)
        
        // Music options - limited selection
        this.musicOptions = {
            'upbeat': 'upbeat_commercial',
            'calm': 'calm_background',
            'energetic': 'energetic_promo',
            'none': null
        };
        
        // Video style - minimal options (slideshow focus)
        this.videoStyles = {
            'slideshow': 'image_slideshow', // Main style we'll use
            'dynamic': 'dynamic_slideshow'  // Optional with zoom/pan
        };
    }

    /**
     * Generate AI script from item description
     * @param {Object} params - Script generation parameters
     * @param {string} params.description - Item description
     * @param {string} params.title - Item title
     * @param {string} params.category - Item category
     * @param {number} params.price - Item price
     * @param {Object} params.details - Additional item details
     * @returns {Promise<Object>} Generated script
     */
    async generateScript(params) {
        const { description, title, category, price, details = {} } = params;
        
        // Build prompt for script generation
        const prompt = this._buildScriptPrompt(description, title, category, price, details);
        
        try {
            const response = await fetch(`${this.baseUrl}/script/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    tone: 'professional', // Professional tone for marketplace ads
                    length: 'short', // 15-30 seconds for social media
                    platform: 'tiktok' // TikTok-style short-form
                })
            });

            if (!response.ok) {
                throw new Error(`Script generation failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                script: result.script,
                scriptId: result.id,
                estimatedDuration: result.duration || 30
            };
        } catch (error) {
            console.error('Error generating script:', error);
            
            // Fallback to client-side script generation for development
            return this._generateFallbackScript(description, title, price, details);
        }
    }

    /**
     * Generate video from images and script
     * @param {Object} params - Video generation parameters
     * @param {Array<File>} params.images - Image files to use
     * @param {string} params.script - Generated script text
     * @param {string} params.music - Music style ('upbeat', 'calm', 'energetic', 'none')
     * @param {string} params.style - Video style ('slideshow' or 'dynamic')
     * @returns {Promise<Object>} Video generation job
     */
    async generateVideo(params) {
        const { images, script, music = 'upbeat', style = 'slideshow' } = params;
        
        try {
            // Convert images to base64 or upload URLs
            const imageData = await this._prepareImages(images);
            
            const response = await fetch(`${this.baseUrl}/video/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    script: script,
                    voice: this.defaultVoice,
                    music: this.musicOptions[music],
                    style: this.videoStyles[style],
                    images: imageData,
                    captions: {
                        enabled: true,
                        style: 'tiktok', // TikTok-style captions
                        position: 'center',
                        animation: true
                    },
                    format: {
                        resolution: '1080x1920', // Vertical 9:16 for mobile
                        fps: 30,
                        quality: 'high'
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Video generation failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                jobId: result.job_id,
                status: result.status || 'processing',
                estimatedTime: result.estimated_time || 60, // seconds
                message: 'Video generation started'
            };
        } catch (error) {
            console.error('Error generating video:', error);
            throw error;
        }
    }

    /**
     * Check video generation status
     * @param {string} jobId - Job ID from generateVideo
     * @returns {Promise<Object>} Job status
     */
    async checkVideoStatus(jobId) {
        try {
            const response = await fetch(`${this.baseUrl}/video/status/${jobId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Status check failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                status: result.status, // 'processing', 'completed', 'failed'
                progress: result.progress || 0, // 0-100
                videoUrl: result.video_url,
                thumbnailUrl: result.thumbnail_url,
                duration: result.duration,
                error: result.error
            };
        } catch (error) {
            console.error('Error checking video status:', error);
            throw error;
        }
    }

    /**
     * Poll for video completion
     * @param {string} jobId - Job ID
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} Completed video data
     */
    async waitForVideo(jobId, onProgress = null) {
        const maxAttempts = 60; // 5 minutes max (5s intervals)
        const pollInterval = 5000; // 5 seconds
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const status = await this.checkVideoStatus(jobId);
            
            if (onProgress) {
                onProgress(status);
            }
            
            if (status.status === 'completed') {
                return {
                    success: true,
                    videoUrl: status.videoUrl,
                    thumbnailUrl: status.thumbnailUrl,
                    duration: status.duration
                };
            }
            
            if (status.status === 'failed') {
                throw new Error(status.error || 'Video generation failed');
            }
            
            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        
        throw new Error('Video generation timeout');
    }

    /**
     * Build script generation prompt
     * @private
     */
    _buildScriptPrompt(description, title, category, price, details) {
        let prompt = `Create an engaging, accurate promotional script for a ${category} listing.\n\n`;
        prompt += `Title: ${title}\n`;
        prompt += `Price: €${price}\n`;
        prompt += `Description: ${description}\n\n`;
        
        // Add category-specific details
        if (category === 'automotive' && details.make) {
            prompt += `Vehicle: ${details.make} ${details.model} (${details.year})\n`;
            if (details.mileage) prompt += `Mileage: ${details.mileage}\n`;
            if (details.transmission) prompt += `Transmission: ${details.transmission}\n`;
            if (details.fuel) prompt += `Fuel: ${details.fuel}\n`;
        }
        
        prompt += `\nRequirements:
- Keep it under 30 seconds when read aloud
- Sound natural and conversational
- Highlight key features and benefits
- Maintain factual accuracy - use ONLY information provided above
- Create urgency without being pushy
- End with a clear call-to-action
- Write for TikTok/Instagram Reels style delivery`;
        
        return prompt;
    }

    /**
     * Generate fallback script (for development without API)
     * @private
     */
    _generateFallbackScript(description, title, price, details) {
        // Simple template-based script generation
        let script = `Check out this amazing ${title}! `;
        
        // Add key points from description (first 2 sentences)
        const sentences = description.split('.').filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
            script += sentences.slice(0, 2).join('. ') + '. ';
        }
        
        script += `Priced at just €${price}. `;
        script += `Don't miss out on this incredible deal! Swipe up to learn more.`;
        
        return {
            script: script,
            scriptId: 'fallback-' + Date.now(),
            estimatedDuration: 25,
            isFallback: true
        };
    }

    /**
     * Prepare images for API upload
     * @private
     */
    async _prepareImages(images) {
        const imageData = [];
        
        for (const image of images) {
            try {
                // Convert File to base64
                const base64 = await this._fileToBase64(image);
                imageData.push({
                    data: base64,
                    filename: image.name,
                    type: image.type
                });
            } catch (error) {
                console.error('Error processing image:', image.name, error);
            }
        }
        
        return imageData;
    }

    /**
     * Convert File to base64
     * @private
     */
    _fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove data URL prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get available music options
     */
    getMusicOptions() {
        return [
            { value: 'upbeat', label: 'Upbeat & Energetic' },
            { value: 'calm', label: 'Calm & Professional' },
            { value: 'energetic', label: 'High Energy' },
            { value: 'none', label: 'No Music' }
        ];
    }

    /**
     * Get available video styles
     */
    getVideoStyles() {
        return [
            { value: 'slideshow', label: 'Slideshow (Recommended)' },
            { value: 'dynamic', label: 'Dynamic Slideshow' }
        ];
    }
}

// Create singleton instance
const revidService = new RevidService();

export default revidService;
