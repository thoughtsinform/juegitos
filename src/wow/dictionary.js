/**
 * Comprehensive English Anagram Dictionary for Words of Wonders (WoW)
 * Contains all crossword answers plus a wide bank of valid 3-to-6 letter
 * English bonus words formable from the level letter wheels.
 */

export const VALID_ENGLISH_WORDS = new Set([
  // Level 1 (C, A, T, S)
  'CAT', 'ACT', 'SAT', 'CAST', 'CATS', 'ACTS', 'SCAT', 'SAC', 'TAS',
  // Level 2 (S, T, A, R)
  'STAR', 'RATS', 'ARTS', 'TARS', 'TSAR', 'ART', 'RAT', 'TAR', 'SAT', 'ARS', 'RAS',
  // Level 3 (S, A, N, D, L)
  'SAND', 'LAND', 'LANDS', 'SANDS', 'LADS', 'SAD', 'LAD', 'AND', 'DAN', 'DAL', 'ALS', 'SAL',
  // Level 4 (S, T, O, N, E)
  'STONE', 'NOTES', 'TONES', 'ONSET', 'STENO', 'SETON', 'NOTE', 'TONE', 'SENT', 'NEST',
  'TENS', 'NETS', 'NOSE', 'ONES', 'EONS', 'SONE', 'SNOT', 'TOES', 'ONE', 'SON', 'TON',
  'NOT', 'NET', 'TEN', 'SET', 'TOE', 'SOT', 'NOS', 'ONS', 'SEN', 'ENS', 'OES',
  // Level 5 (W, A, T, E, R)
  'WATER', 'RATE', 'TEAR', 'WEAR', 'WARE', 'WART', 'TARE', 'WERT', 'TWae', 'RAW', 'WAR',
  'ART', 'RAT', 'TAR', 'EAR', 'ERA', 'ARE', 'EAT', 'ATE', 'TEA', 'WET', 'AWE', 'TAW', 'WAT', 'ETA', 'RET',
  // Level 6 (P, L, A, N, E, T)
  'PLANET', 'PLANT', 'PLATE', 'PLANE', 'PLEAT', 'PANEL', 'PETAL', 'PENAL', 'PLATEN',
  'LEANT', 'LEAPT', 'PALET', 'LEPTA', 'TEPAl', 'PLAN', 'PALE', 'PEAL', 'PLEA', 'LEAP',
  'LATE', 'TALE', 'TEAL', 'TAEL', 'LANE', 'LEAN', 'ELAN', 'NEAT', 'ANTE', 'ETNA', 'TAPE',
  'PEAT', 'PATE', 'PANT', 'PENT', 'LENT', 'PELT', ' NAPE', 'NEAP', 'PANE', 'PEAN', 'PLAT',
  'PAN', 'PAL', 'LAP', 'ALP', 'PAT', 'TAP', 'APT', 'PET', 'PEN', 'PEA', 'APE', 'LET', 'TEL',
  'LAT', 'ALT', 'NET', 'TEN', 'ANT', 'TAN', 'ATE', 'EAT', 'TEA', 'ETA', 'ALE', 'LEA', 'ANE',
  // Level 7 (C, R, O, W, N, S)
  'CROWNS', 'CROWN', 'SCORN', 'CORNS', 'CROWS', 'WORN', 'CORN', 'CROW', 'SNOW', 'SOWN',
  'OWNS', 'ROWS', 'SCOW', 'COWS', 'ROCS', 'CONS', 'SORn', 'MORN', 'COW', 'ROW', 'OWN',
  'NOW', 'WON', 'SON', 'NOR', 'CON', 'COS', 'ORS', 'ROC', 'COR', 'ONS', 'NOS',
  // Level 8 (G, A, R, D, E, N)
  'GARDEN', 'DANGER', 'GANDER', 'RANGED', 'GRANDE', 'GRAND', 'GRADE', 'RAGE', 'GEAR',
  'DEAR', 'DARE', 'READ', 'NEAR', 'EARN', 'AGED', 'EGAD', 'DRAG', 'GRAD', 'GARB', 'DEAN',
  'DANE', ' NARD', 'RAND', 'RANG', 'GNAR', 'GRAN', 'DREG', 'AGER', 'ARED', 'RED', 'EAR',
  'ERA', 'ARE', 'RAN', 'RAG', 'GAR', 'DAG', 'GAD', 'AND', 'DAN', 'END', 'DEN', 'AGE', 'GAE',
  'GED', 'DEG', 'NAG', 'GAN', 'GEN', 'ENG', 'RAD', 'DAR', 'ARD',
  // Additional Level 9 & 10 Words (S, H, O, R, E, S / T, E, M, P, L, E)
  'SHORE', 'HORSE', 'HERO', 'ROSE', 'SORE', 'SHOE', 'HOSE', 'HOES', 'ROES', 'ORES', 'HERS',
  'RESH', 'EROS', 'HER', 'SHE', 'ORE', 'ROE', 'HOE', 'ORS', 'SER',
  'TEMPLE', 'PELMET', 'MELT', 'PELT', 'TEMP', 'MEET', 'TEEM', 'METE', 'PEEL', 'PELE',
  'LEET', 'TELE', 'MET', 'PET', 'LET', 'ELM', 'MEL', 'PEE', 'TEE', 'EME', 'LEE', 'EEL',
  // General Common English Bonus Vocabulary
  'ABLE', 'ACID', 'AGED', 'ALSO', 'AREA', 'ARMY', 'AWAY', 'BABY', 'BACK', 'BALL', 'BAND',
  'BANK', 'BASE', 'BATH', 'BEAR', 'BEAT', 'BEEN', 'BEER', 'BELL', 'BELT', 'BEST', 'BILL',
  'BIRD', 'BLOW', 'BLUE', 'BOAT', 'BODY', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BORN',
  'BOSS', 'BOTH', 'BOWL', 'BULK', 'BURN', 'BUSH', 'BUSY', 'CALL', 'CALM', 'CAME', 'CAMP',
  'CARD', 'CARE', 'CASE', 'CASH', 'CELL', 'CHAT', 'CHIP', 'CITY', 'CLUB', 'COAL', 'COAT',
  'CODE', 'COLD', 'COME', 'COOK', 'COOL', 'COPE', 'COPY', 'CORE', 'COST', 'CREW', 'CROP',
  'DARK', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DEAD', 'DEAL', 'DECK', 'DEEP', 'DESK', 'DIAL',
  'DIET', 'DIRT', 'DISC', 'DISK', 'DOES', 'DONE', 'DOOR', 'DOSE', 'DOWN', 'DRAW', 'DREW',
  'DROP', 'DRUG', 'DUAL', 'DUKE', 'DUST', 'DUTY', 'EACH', 'EAST', 'EASY', 'EDGE', 'ELSE',
  'EVEN', 'EVER', 'EVIL', 'EXIT', 'FACE', 'FACT', 'FAIL', 'FAIR', 'FALL', 'FARM', 'FAST',
  'FATE', 'FEAR', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FILE', 'FILL', 'FILM', 'FIND',
  'FINE', 'FIRE', 'FIRM', 'FISH', 'FIVE', 'FLAT', 'FLOW', 'FOOD', 'FOOT', 'FORD', 'FORM',
  'FORT', 'FOUR', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND', 'GAIN', 'GAME', 'GATE', 'GAVE',
  'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GOAL', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GRAY',
  'GREW', 'GREY', 'GROW', 'GULF', 'HAIR', 'HALF', 'HALL', 'HAND', 'HANG', 'HARD', 'HARM',
  'HATE', 'HAVE', 'HEAD', 'HEAR', 'HEAT', 'HELD', 'HELL', 'HELP', 'HERE', 'HIGH', 'HILL',
  'HIRE', 'HOLD', 'HOLE', 'HOLY', 'HOME', 'HOPE', 'HOST', 'HOUR', 'HUGE', 'HUNG', 'HUNT',
  'HURT', 'IDEA', 'INCH', 'INTO', 'IRON', 'ITEM', 'JACK', 'JANE', 'JEAN', 'JOHN', 'JOIN',
  'JUMP', 'JURY', 'JUST', 'KEEN', 'KEEP', 'KENT', 'KEPT', 'KICK', 'KILL', 'KIND', 'KING',
  'KNEE', 'KNEW', 'KNOW', 'LACK', 'LADY', 'LAID', 'LAKE', 'LAST', 'LEAD', 'LEFT', 'LESS',
  'LIFE', 'LIFT', 'LIKE', 'LINE', 'LINK', 'LIST', 'LIVE', 'LOAD', 'LOAN', 'LOCK', 'LOGO',
  'LONG', 'LOOK', 'LORD', 'LOSE', 'LOSS', 'LOST', 'LOVE', 'LUCK', 'MADE', 'MAIL', 'MAIN',
  'MAKE', 'MALE', 'MANY', 'MARK', 'MASS', 'MATT', 'MEAL', 'MEAN', 'MEAT', 'MENU', 'MERE',
  'MIKE', 'MILE', 'MILK', 'MILL', 'MIND', 'MINE', 'MISS', 'MODE', 'MOOD', 'MOON', 'MORE',
  'MOST', 'MOVE', 'MUCH', 'MUST', 'NAME', 'NAVY', 'NECK', 'NEED', 'NEWS', 'NEXT', 'NICE',
  'NICK', 'NINE', 'NONE', 'NOON', 'NORM', 'OKAY', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL',
  'OVER', 'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALM', 'PARK', 'PART', 'PASS',
  'PAST', 'PATH', 'PEAK', 'PICK', 'PINK', 'PIPE', 'PLAY', 'PLOT', 'PLUG', 'PLUS', 'POLL',
  'POOL', 'POOR', 'PORT', 'POST', 'PULL', 'PURE', 'PUSH', 'RACE', 'RAIL', 'RAIN', 'RANK',
  'RARE', 'REAL', 'REAR', 'RELY', 'RENT', 'REST', 'RICE', 'RICH', 'RIDE', 'RING', 'RISE',
  'RISK', 'ROAD', 'ROCK', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'RULE', 'RUSH',
  'RUTH', 'SAFE', 'SAID', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAVE', 'SEAT', 'SEED', 'SEEK',
  'SEEM', 'SEEN', 'SELF', 'SELL', 'SEND', 'SEPT', 'SHIP', 'SHOP', 'SHOT', 'SHOW', 'SHUT',
  'SICK', 'SIDE', 'SIGN', 'SITE', 'SIZE', 'SKIN', 'SLIP', 'SLOW', 'SOFT', 'SOIL', 'SOLD',
  'SOLE', 'SOME', 'SONG', 'SOON', 'SORT', 'SOUL', 'SPOT', 'STAY', 'STEP', 'STOP', 'SUCH',
  'SUIT', 'SURE', 'TAKE', 'TALK', 'TALL', 'TANK', 'TASK', 'TEAM', 'TECH', 'TELL', 'TEND',
  'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUS',
  'TILL', 'TIME', 'TINY', 'TOLD', 'TOLL', 'TONY', 'TOOK', 'TOOL', 'TOUR', 'TOWN', 'TREE',
  'TRIP', 'TRUE', 'TUNE', 'TURN', 'TWIN', 'TYPE', 'UNIT', 'UPON', 'USED', 'USER', 'VARY',
  'VAST', 'VERY', 'VICE', 'VIEW', 'VOTE', 'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WANT',
  'WARD', 'WARM', 'WASH', 'WAVE', 'WAYS', 'WEAK', 'WEEK', 'WELL', 'WENT', 'WERE', 'WEST',
  'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WIND', 'WINE', 'WING', 'WIRE',
  'WISE', 'WISH', 'WITH', 'WOOD', 'WORD', 'WORE', 'WORK', 'YARD', 'YEAR', 'YOUR', 'ZERO', 'ZONE'
]);
