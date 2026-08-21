# Database Schema

## Collections

### users
| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| name | String | Yes | — | — |
| email | String | Yes | — | unique |
| passwordHash | String | Yes | — | — |
| avatarUrl | String | No | '' | — |
| isPro | Boolean | No | false | — |
| planName | String | No | 'Free Tier' | — |
| role | String(admin,user) | No | 'user' | — |
| status | String(active,pending,suspended) | No | 'active' | — |
| offlineStorageUsedMB | Number | No | 0 | — |
| maxStorageMB | Number | No | 8000 | — |
| audioQuality | String(enum) | No | 'High (320kbps)' | — |
| downloadOnlyOnWifi | Boolean | No | true | — |
| isStudentVerified | Boolean | No | false | — |
| universityName | String | No | '' | — |
| likedTrackIds | ObjectId[] ref Track | No | [] | — |
| downloadedTrackIds | ObjectId[] ref Track | No | [] | — |
| createdAt | Date | auto | — | — |
| updatedAt | Date | auto | — | — |

### tracks
| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| title | String | Yes | — | text |
| artist | String | Yes | — | text |
| album | String | No | '' | text |
| genre | String(enum) | Yes | — | yes |
| duration | Number | Yes | — | — |
| coverUrl | String | No | '' | — |
| isPro | Boolean | No | false | — |
| binauralFreq | Number | No | null | — |
| audioPreset | String(enum) | Yes | — | — |
| description | String | No | '' | — |
| language | String(enum) | No | null | yes |
| ragaTime | String(enum) | No | null | — |
| moodTag | String | No | '' | text |

### albums
| Field | Type | Required | Default |
|-------|------|----------|---------|
| title | String | Yes | — |
| artist | String | Yes | — |
| coverUrl | String | No | '' |
| trackCount | Number | No | 0 |
| isPro | Boolean | No | false |
| genre | String | No | '' |
| year | Number | No | current year |

### playlists
| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| title | String | Yes | — | — |
| description | String | No | '' | — |
| coverUrl | String | No | '' | — |
| tracks | ObjectId[] ref Track | No | [] | — |
| isCustom | Boolean | No | true | — |
| isPro | Boolean | No | false | — |
| createdBy | ObjectId ref User | No | null | yes |

### supporttickets
| Field | Type | Required | Index |
|-------|------|----------|-------|
| userId | ObjectId ref User | Yes | yes |
| userName | String | Yes | — |
| userEmail | String | Yes | — |
| subject | String | Yes | — |
| category | String(enum) | Yes | — |
| message | String | Yes | — |
| priority | String(enum) | No | — |
| status | String(enum) | No | yes |

### adminlogs
| Field | Type | Required | Index |
|-------|------|----------|-------|
| action | String | Yes | — |
| adminName | String | Yes | — |
| targetUser | String | No | — |
| details | String | No | — |
| type | String(enum) | Yes | — |
| createdAt | Date | auto | desc |

### faqs
| Field | Type | Required | Index |
|-------|------|----------|-------|
| category | String | Yes | yes |
| question | String | Yes | — |
| answer | String | Yes | — |
| tags | String[] | No | yes |

## Relationships
- User.likedTrackIds → Track (many-to-many)
- User.downloadedTrackIds → Track (many-to-many)
- Playlist.tracks → Track (many-to-many)
- Playlist.createdBy → User (many-to-one)
- SupportTicket.userId → User (many-to-one)
