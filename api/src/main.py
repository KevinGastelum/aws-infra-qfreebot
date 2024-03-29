from env import BybitKeys
from fastapi import FastAPI, HTTPException
from mangum import Mangum
import uvicorn
import json
from quantfreedom.exchanges.bybit_exchange.bybit import Bybit
from quantfreedom.enums import PositionModeType

# api_key = BybitKeys.api_key
# secret_key = BybitKeys.secret_key
# use_test_net = BybitKeys.use_test_net

# url = "https://coy64pcuz2kkvbwyirjhxqbmqa0sbxnt.lambda-url.ca-central-1.on.aws/"

bybit_test = Bybit(
    api_key=BybitKeys.testnet_api_key,
    secret_key=BybitKeys.testnet_secret_key,
    use_test_net=True,
  )
# wallet_info = bybit_test.get_wallet_info()
# # print(json.dumps(wallet_info, indent=4))
# wallet_balance = wallet_info[0]["coin"][0]["walletBalance"]
# print(wallet_balance)

app = FastAPI()
handler = Mangum(app)


@app.post("/trade")
async def create_buy(symbol="BTCUSDT", buy_sell= "Buy", asset_size=0.001, order_type= "Market", position_mode=PositionModeType.BuySide):
  create_order = bybit_test.create_order(symbol=symbol, buy_sell=buy_sell, asset_size=asset_size, order_type=order_type, position_mode=position_mode)

  return {"statusCode": 200, "orderCreated": create_order}


@app.get("/wallet")
def get_wallet_information():
  wallet_info = bybit_test.get_wallet_info()
  # wallet_info = json.dumps(wallet_info)
  wallet_balance = float(wallet_info[0]["coin"][0]["walletBalance"])
  return { "myBalance": wallet_balance}


# run_strat()

# if __name__ == "__main__":
    # url = "https://coy64pcuz2kkvbwyirjhxqbmqa0sbxnt.lambda-url.ca-central-1.on.aws/"
    # params = {
    #    api_key=api_key
    #    secret_key=secret_key
    #    use_test_net=True
    # }
    
    # run_strat(url, params)
    # uvicorn.run(app, host="127.0.0.1", port=8001)




#   symbol = "BTCUSDT"
#   trading_with = "USDT"

#   wallet_info = bybit_test.get_wallet_info()
#   wallet_balance = float(wallet_info[0]["coin"][0]["walletBalance"])
  
#   return { "statusCode": 200, "body": {"msg": wallet_balance}}