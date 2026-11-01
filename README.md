# Tipspromenad  
  
A browser-based geolocation trivia walk ("tipspromenad" = Swedish quiz walk). Walk to GPS checkpoints to unlock trivia questions fetched from the Open Trivia Database.  
  
## How it works  
  
- On load, the app fetches 10 medium-difficulty multiple-choice questions (category 12 – Music) from OpenTDB.  
- Every 5 seconds, `geoFindMe()` polls `navigator.geolocation` and compares your position against 10 hardcoded checkpoints near Stockholm (Södertälje area, ~59.10 N, 17.51 E).  
- When you're within ~90 m of a checkpoint, a question card appears and the OpenStreetMap iframe updates to show the target.  
- Answer correctly to score; each question is marked as shown so it won't trigger again.  
- Use **There?** to check your position manually, **Prev/Next** to change the target checkpoint, and **Give up** to end the game and see your score.  
  
## Requirements  
  
- A modern browser with Geolocation API support.  
- Served over **HTTPS** or **localhost** — browsers block geolocation on plain `file://` or HTTP origins.  
- Internet access for the OpenTDB API and the OpenStreetMap embed.  
  
## Getting started  
  
```bash  
git clone https://github.com/DavRan90/Tipspromenad.git  
cd Tipspromenad  
# Any static server works, e.g.:  [header-1](#header-1)
python3 -m http.server 8000
