const User = require('../models/User');
const Track = require('../models/Track');
const { DOWNLOAD_SIZE_MB } = require('../utils/constants');

class LibraryService {
  /**
   * Get user's liked tracks
   */
  async getLikedTracks(userId) {
    const user = await User.findById(userId).populate('likedTrackIds');
    return user?.likedTrackIds || [];
  }

  /**
   * Like a track
   */
  async likeTrack(userId, trackId) {
    const track = await Track.findById(trackId);
    if (!track) {
      const error = new Error('Track not found');
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { likedTrackIds: trackId },
    });

    return { liked: true, trackId };
  }

  /**
   * Unlike a track
   */
  async unlikeTrack(userId, trackId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { likedTrackIds: trackId },
    });

    return { liked: false, trackId };
  }

  /**
   * Get downloaded tracks
   */
  async getDownloadedTracks(userId) {
    const user = await User.findById(userId).populate('downloadedTrackIds');
    return user?.downloadedTrackIds || [];
  }

  /**
   * Mark track as downloaded (BR-007, BR-009)
   */
  async downloadTrack(userId, trackId) {
    const track = await Track.findById(trackId);
    if (!track) {
      const error = new Error('Track not found');
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(userId);

    // BR-009: Pro content gating — block download for non-pro users
    if (track.isPro && !user.isPro) {
      const error = new Error(
        'This track requires a Pro or Student plan. Upgrade to access Hi-Res downloads.'
      );
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Check storage limit
    if (user.offlineStorageUsedMB + DOWNLOAD_SIZE_MB > user.maxStorageMB) {
      const error = new Error('Insufficient offline storage. Upgrade your plan or clear downloads.');
      error.statusCode = 400;
      error.code = 'STORAGE_LIMIT';
      throw error;
    }

    // Add to downloads and update storage
    await User.findByIdAndUpdate(userId, {
      $addToSet: { downloadedTrackIds: trackId },
      $inc: { offlineStorageUsedMB: DOWNLOAD_SIZE_MB },
    });

    return { downloaded: true, trackId };
  }

  /**
   * Remove download (BR-007)
   */
  async removeDownload(userId, trackId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { downloadedTrackIds: trackId },
      $inc: { offlineStorageUsedMB: -DOWNLOAD_SIZE_MB },
    });

    // Ensure storage doesn't go below 0
    await User.findByIdAndUpdate(userId, {
      $max: { offlineStorageUsedMB: 0 },
    });

    return { downloaded: false, trackId };
  }

  /**
   * Clear all offline data (BR-007)
   */
  async clearAllDownloads(userId) {
    await User.findByIdAndUpdate(userId, {
      downloadedTrackIds: [],
      offlineStorageUsedMB: 0,
    });

    return { cleared: true };
  }
}

module.exports = new LibraryService();
