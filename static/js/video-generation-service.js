/**
 * AI Video Generation Service
 * 
 * Custom pipeline using OpenAI APIs for video generation
 * - Script generation using GPT-4o Mini ($0.001/video)
 * - Text-to-speech using OpenAI TTS HD ($0.003/video)
 * - Video rendering with FFmpeg on serverless ($/0.002-0.007/video)
 * - Storage on Cloudflare R2 ($0.015/GB)
 * 
 * Total cost: ~$0.024 per video (95%+ savings vs commercial APIs)
 * 
 * @see VIDEO_PIPELINE_COMPARISON.md for full technical details
 */

class VideoGenerationService {
    constructor() {
        // API Configuration - all calls proxied through backend
        this.baseUrl = '/api/video';
        
        // Voice configuration - using OpenAI TTS voices
        this.defaultVoice = 'alloy'; // Professional, clear voice
        this.voices = {
            'alloy': 'alloy',     // Neutral, balanced
            'echo': 'echo',       // Male, clear
            'fable': 'fable',     // British accent
            'onyx': 'onyx',       // Deep, authoritative
            'nova': 'nova',       // Warm, engaging
            'shimmer': 'shimmer'  // Soft, friendly
        };
        
        // Music options - curated selection for marketplace ads
        this.musicOptions = {
            'upbeat': 'upbeat',
            'calm': 'calm',
            'energetic': 'energetic',
            'none': null
        };
        
        // Video configuration
        this.videoConfig = {
            resolution: '1080x1920',  // Portrait 9:16
            fps: 30,
            duration: 15,  // Target duration in seconds
            format: 'mp4'
        };
    }

    /**
     * Generate AI script from item description
     * Uses GPT-4o Mini for cost-effective script generation
     * 
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
        
        try {
            const response = await fetch(`${this.baseUrl}/generate-script`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                },
                body: JSON.stringify({
                    description,
                    title,
                    category,
                    price,
                    details
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Script generation failed');
            }

            const result = await response.json();
            
            return {
                success: true,
                script: result.script,
                estimatedDuration: result.estimatedDuration || 15
            };
            
        } catch (error) {
            console.error('Script generation error:', error);
            
            // Fallback script for demo/testing
            return {
                success: false,
                script: this._generateFallbackScript(title, description, price),
                estimatedDuration: 15,
                error: error.message
            };
        }
    }

    /**
     * Generate video from images and script
     * Coordinates: script → TTS → video rendering → upload
     * 
     * @param {Object} params - Video generation parameters
     * @param {string} params.script - Video script
     * @param {Array} params.files - Image/video files
     * @param {string} params.music - Music selection
     * @param {string} params.voice - TTS voice
     * @param {Object} params.metadata - Video metadata
     * @returns {Promise<Object>} Job ID for tracking
     */
    async generateVideo(params) {
        const {
            script,
            files = [],
            music = 'upbeat',
            voice = this.defaultVoice,
            metadata = {}
        } = params;

        try {
            // Upload files first (gets presigned URLs)
            const uploadedFiles = await this._uploadFiles(files);

            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                },
                body: JSON.stringify({
                    script,
                    files: uploadedFiles,
                    music: this.musicOptions[music],
                    voice: this.voices[voice] || this.defaultVoice,
                    config: this.videoConfig,
                    metadata
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Video generation failed');
            }

            const result = await response.json();
            
            return {
                success: true,
                jobId: result.jobId,
                estimatedTime: result.estimatedTime || 90  // seconds
            };
            
        } catch (error) {
            console.error('Video generation error:', error);
            throw error;
        }
    }

    /**
     * Check video generation status
     * Polls backend for job progress
     * 
     * @param {string} jobId - Job ID from generateVideo
     * @returns {Promise<Object>} Status and progress
     */
    async checkStatus(jobId) {
        try {
            const response = await fetch(`${this.baseUrl}/status/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to check status');
            }

            const result = await response.json();
            
            return {
                status: result.status,  // 'queued', 'script', 'audio', 'captions', 'render', 'upload', 'complete', 'error'
                progress: result.progress,  // 0-100
                elapsed: result.elapsed,  // seconds
                videoUrl: result.videoUrl,
                error: result.error
            };
            
        } catch (error) {
            console.error('Status check error:', error);
            throw error;
        }
    }

    /**
     * Wait for video completion
     * Polls status until video is ready or error occurs
     * 
     * @param {string} jobId - Job ID from generateVideo
     * @param {Function} onProgress - Progress callback (optional)
     * @param {number} pollInterval - Poll interval in ms (default 2000)
     * @returns {Promise<Object>} Final result with video URL
     */
    async waitForVideo(jobId, onProgress = null, pollInterval = 2000) {
        return new Promise((resolve, reject) => {
            const poll = setInterval(async () => {
                try {
                    const status = await this.checkStatus(jobId);
                    
                    // Call progress callback if provided
                    if (onProgress) {
                        onProgress(status);
                    }
                    
                    // Check for completion
                    if (status.status === 'complete') {
                        clearInterval(poll);
                        resolve({
                            success: true,
                            videoUrl: status.videoUrl,
                            elapsed: status.elapsed
                        });
                    } else if (status.status === 'error') {
                        clearInterval(poll);
                        reject(new Error(status.error || 'Video generation failed'));
                    }
                    
                } catch (error) {
                    clearInterval(poll);
                    reject(error);
                }
            }, pollInterval);

            // Timeout after 5 minutes
            setTimeout(() => {
                clearInterval(poll);
                reject(new Error('Video generation timed out'));
            }, 300000);
        });
    }

    /**
     * Upload files to cloud storage
     * Gets presigned URLs and uploads directly to R2/S3
     * 
     * @private
     * @param {Array} files - Files to upload
     * @returns {Promise<Array>} Uploaded file URLs
     */
    async _uploadFiles(files) {
        const uploadedFiles = [];

        for (const file of files) {
            try {
                // Get presigned upload URL
                const urlResponse = await fetch(`${this.baseUrl}/upload-url`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                    },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type
                    })
                });

                const { uploadUrl, fileKey } = await urlResponse.json();

                // Upload directly to storage
                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });

                uploadedFiles.push({
                    key: fileKey,
                    type: file.type,
                    name: file.name
                });
                
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                throw error;
            }
        }

        return uploadedFiles;
    }

    /**
     * Generate fallback script for testing/demo
     * Used when AI generation fails or API is unavailable
     * 
     * @private
     * @param {string} title - Item title
     * @param {string} description - Item description
     * @param {number} price - Item price
     * @returns {string} Fallback script
     */
    _generateFallbackScript(title, description, price) {
        return `Check out this amazing ${title}. ${description.substring(0, 100)}. Available now for just ${price} euros. Don't miss this opportunity!`;
    }

    /**
     * Cancel video generation job
     * 
     * @param {string} jobId - Job ID to cancel
     * @returns {Promise<Object>} Cancellation result
     */
    async cancelJob(jobId) {
        try {
            const response = await fetch(`${this.baseUrl}/cancel/${jobId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                }
            });

            return await response.json();
            
        } catch (error) {
            console.error('Job cancellation error:', error);
            throw error;
        }
    }
}

// Create singleton instance
const videoGenerationService = new VideoGenerationService();

// Export for use in other modules
export default videoGenerationService;
