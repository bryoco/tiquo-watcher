import * as util from 'util'
import * as bson from "bson"
import { OptionChain } from '../model/ameritrade/type'

export class Utils {
    static expandedConsoleLog(obj: any) {
        console.log(util.inspect(obj, false, null, true /* enable colors */))
    }

    static compressChain(chain: OptionChain): any {
        const clonedChain = chain as any
        clonedChain.callExpDateMap = bson.serialize(clonedChain.callExpDateMap)
        clonedChain.putExpDateMap = bson.serialize(clonedChain.putExpDateMap)
        // clonedChain.timeFetched = chain.timeFetched.getTime() wont work
        clonedChain.timeFetched = Date.parse(chain.timeFetched.toString())
        return clonedChain
    }

    static decompressChain(obj: any): OptionChain {
        if (obj["_id"]) {
            if (obj["callExpDateMap"])
                // mongo stores bson as an BinData() object, whereas dynamo just stores the string
                obj["callExpDateMap"] = obj["callExpDateMap"].buffer ? 
                    bson.deserialize(obj["callExpDateMap"].buffer) : // deserialize the "buffer" field of BinData object from mongo
                    bson.deserialize(obj["callExpDateMap"])          // deserialize string from dynamo
            if (obj["putExpDateMap"])
                obj["putExpDateMap"] = obj["putExpDateMap"].buffer ? 
                    bson.deserialize(obj["putExpDateMap"].buffer) :
                    bson.deserialize(obj["putExpDateMap"])
        }

        return (obj as OptionChain)
    }
}
