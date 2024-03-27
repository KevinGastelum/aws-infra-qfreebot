from fastapi import FastAPI
from mangum import Mangum
import uvicorn
from quantfreedom.exchanges.bybit_exchange.bybit import Bybit

url = "https://coy64pcuz2kkvbwyirjhxqbmqa0sbxnt.lambda-url.ca-central-1.on.aws/"

bybit_test = Bybit(
    api_key='TklPMA9BSvSAJE5vPa',
    secret_key='PD9wes544gRJdM2v9m463PrzdSRD8P0aGdBL',
    use_test_net=True,
  )

app = FastAPI()
handler = Mangum(app)

@app.get("/")
def run_strat():
    






run_strat()

if __name__ == "__main__":
    # url = "https://coy64pcuz2kkvbwyirjhxqbmqa0sbxnt.lambda-url.ca-central-1.on.aws/"
    # params = {
    #    api_key=api_key
    #    secret_key=secret_key
    #    use_test_net=True
    # }
    
    # run_strat(url, params)
    uvicorn.run(app, host="127.0.0.1", port=8000)




#   symbol = "BTCUSDT"
#   trading_with = "USDT"

#   wallet_info = bybit_test.get_wallet_info()
#   wallet_balance = float(wallet_info[0]["coin"][0]["walletBalance"])
  
#   return { "statusCode": 200, "body": {"msg": wallet_balance}}