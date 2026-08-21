const ApiResponse = require('../utils/apiResponse');

/**
 * BR-009 — Pro content gating middleware.
 * Blocks downloads of pro-marked tracks/playlists for non-pro users.
 * Attach to download routes only — streaming remains unrestricted.
 *
 * Usage:
 *   router.post('/downloads/:trackId', authenticate, proGate, libraryController.downloadTrack);
 *
 * Expects req.user to be set by authenticate middleware.
 * Expects req.track to be set by a prior track-fetch middleware, OR
 * evaluates lazily inside libraryService (preferred — see libraryService.downloadTrack).
 *
 * This middleware provides a fast pre-check when the track is already on the request.
 * If the track is not pre-loaded, the service layer enforces the rule.
 */
const proGate = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required.');
  }

  // If a track was pre-loaded on req.track, check it now
  if (req.track && req.track.isPro && !req.user.isPro) {
    return ApiResponse.forbidden(
      res,
      'This track requires a Pro or Student plan. Upgrade to access Hi-Res downloads.'
    );
  }

  next();
};

/**
 * Async pro gate — fetches the track and checks isPro.
 * Use this on routes where the track isn't pre-loaded.
 */
const proGateAsync = (Model) => async (req, res, next) => {
  try {
    const trackId = req.params.trackId || req.params.id;
    if (!trackId) return next();

    const resource = await Model.findById(trackId).select('isPro');
    if (resource && resource.isPro && !req.user.isPro) {
      return ApiResponse.forbidden(
        res,
        'This content requires a Pro or Student plan. Upgrade to access Hi-Res downloads.'
      );
    }

    next();
  } catch {
    next(); // If lookup fails, let the service handle it
  }
};

module.exports = { proGate, proGateAsync };
