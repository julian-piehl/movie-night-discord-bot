import { isNullish } from '@sapphire/utilities';
import { existsSync } from 'fs';

export const OwnerID = process.env.OWNER_ID || '482280103058079775';
export const LogChannelID = process.env.LOG_CHANNEL_ID || null;

export const TmdbID = process.env.TMDB_ID || null;

export const LimitVotes = isNullish(process.env.MOVIEBOT_LIMIT_VOTES)
  ? true
  : process.env.MOVIEBOT_LIMIT_VOTES === 'true';

export const ImageCachePath = existsSync('/.dockerenv') ? '/data/imageCache' : './data/bot/imageCache';
