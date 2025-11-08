from fastapi import FastAPI
from pytrends.request import TrendReq
import numpy as np

app = FastAPI()

@app.get("/analyze")
def analyze(keyword: str):
    # Connect to Google Trends for pizza keyword
    pytrends = TrendReq(hl='en-US')
    pytrends.build_payload([keyword])

    '''
    Pandas DataFrame with interest over time (weekly data for the past 5 years, where the top is the earliest time)
    Under pizza is the interest score (0-100) and isPartial indicates if the data point is partial (True for the current week)
    Interest score calculation: count all searches for pizza in a week, divide by total searches of all topics of that same interval and normalizes it to 100
                pizza  isPartial
    date
    2020-11-08     74      False
    2020-11-15     72      False
    2020-11-22     69      False
    2020-11-29     73      False
    2020-12-06     73      False
    '''
    data = pytrends.interest_over_time()

    # Calculate week-over-week growth rate
    data['growth_rate'] = data[keyword].pct_change().fillna(0)

    # How recent and rapidly a trend is moving upward or downward from the last 4 weeks
    data['momentum'] = data[keyword].rolling(4).mean().pct_change().fillna(0)

    # How unstable or noisy the trend is over time from the last 4 weeks
    data['volatility'] = data[keyword].rolling(4).std().fillna(0)

    # Composite emerging score combining growth rate, momentum, and volatility (how likely is this a trend rather than a fad)
    data['emerging_score'] = (data['growth_rate'] * data['momentum']) / data['volatility'].replace(0, np.nan).fillna(1e-6)

    result = {
        "marketData": data,
        "keyInsights": [
            f"{keyword} placeholder insight 1",
            f"{keyword} placeholder insight 2"
        ],
        "competitorAnalysis": [],
        "sources": [{"url": "https://trends.google.com", "title": "Google Trends", "relevance": 1.0}]
    }

    return result
