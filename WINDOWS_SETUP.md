# Windows Setup Guide - Medical AI

## 🚀 Quick Setup (Automated)

### Option 1: Run the Setup Script
1. **Clone the repository:**
   ```cmd
   git clone https://github.com/Seventie/NLP_MEDICAL_AI.git
   cd NLP_MEDICAL_AI
   ```

2. **Run the Windows setup script:**
   ```cmd
   setup-windows.bat
   ```

3. **Start the server:**
   ```cmd
   npm run dev
   ```

## 🛠️ Manual Setup (If script fails)

### Step 1: Pull Latest Changes
```cmd
git pull origin main
```

### Step 2: Clean Previous Installation
```cmd
# Remove old node_modules and lock file
rmdir /s /q node_modules
del package-lock.json

# Clear npm cache
npm cache clean --force
```

### Step 3: Install Dependencies
```cmd
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Step 4: Setup Environment
```cmd
# Copy environment template
copy .env.example .env

# Edit .env file and add your GROQ_API_KEY
notepad .env
```

### Step 5: Start the Server

**Option A (Recommended):**
```cmd
npm run dev
```

**Option B (If NODE_ENV error occurs):**
```cmd
npm run dev:win
```

**Option C (Manual command):**
```cmd
set NODE_ENV=development && tsx server/index.ts
```

## ❌ Common Errors & Solutions

### Error: "NODE_ENV is not recognized"
**Solution 1:**
```cmd
git pull origin main
npm install
npm run dev
```

**Solution 2:**
```cmd
npm run dev:win
```

**Solution 3:**
```cmd
set NODE_ENV=development && tsx server/index.ts
```

### Error: "@types/csv-parser not found"
**Solution:**
```cmd
git pull origin main
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Error: "Python not found"
**Solution:**
1. Install Python 3.8+ from https://python.org/
2. Make sure Python is added to PATH during installation
3. Restart command prompt
4. Test: `python --version`

### Error: "Models not loaded"
**Check these files exist:**
- `embeddings/faiss_index_cpu.index`
- `embeddings/encoded_docs.npy`
- `kg_rag_artifacts/faiss.index`
- `kg_rag_artifacts/corpus_embeddings.npy`
- `kg_rag_artifacts/medical_kg.graphml`
- `drugs_side_effects.csv`

### Error: "GROQ_API_KEY not found"
1. Get API key from https://console.groq.com/
2. Edit `.env` file:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```
3. Restart the server

### Error: TypeScript compilation errors
**Solution:**
```cmd
git pull origin main
npm run check
```

## 🔍 Verification Commands

### Check Node.js Setup
```cmd
node --version
npm --version
```

### Check Python Setup
```cmd
python --version
pip --version
```

### Check Dependencies
```cmd
# Check if cross-env is installed
npm list cross-env

# Check if TypeScript compiles
npm run check

# Test Python models
cd models
python model_service.py health
```

### Check Server Health
After starting the server, visit:
- http://localhost:5000/api/health
- http://localhost:5000/api/drugs/stats

## 📂 Required File Structure
```
NLP_MEDICAL_AI/
├── .env                          # YOUR API KEYS
├── drugs_side_effects.csv        # Drug database
├── embeddings/
│   ├── faiss_index_cpu.index    # Q&A model index
│   └── encoded_docs.npy          # Q&A embeddings
├── kg_rag_artifacts/
│   ├── faiss.index              # Recommendation index
│   ├── corpus_embeddings.npy    # Recommendation embeddings
│   ├── medical_kg.graphml       # Knowledge graph
│   └── ner_entities.csv         # Medical entities
└── models/
    ├── qa.py                    # Q&A model
    ├── medical_v3.py           # Recommendation model
    └── model_service.py        # Unified service
```

## 🎯 Final Steps

1. **Ensure all files are present** (see structure above)
2. **Add your GROQ_API_KEY** to `.env` file
3. **Pull latest changes:** `git pull origin main`
4. **Install dependencies:** `npm install`
5. **Start server:** `npm run dev`
6. **Visit:** http://localhost:5000

## 🆘 Still Having Issues?

1. **Check console output** for specific error messages
2. **Verify all prerequisites** are installed
3. **Ensure model files** are in correct locations
4. **Check API key** is valid and has usage remaining
5. **Try Windows-specific commands** (`npm run dev:win`)

If problems persist, check the GitHub repository for the latest updates and ensure you have the most recent version of all files.
