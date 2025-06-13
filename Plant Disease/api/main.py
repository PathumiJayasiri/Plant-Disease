from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"message": "hell alive"}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8010)
