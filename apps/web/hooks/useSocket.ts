import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/config";

export function useSocket(){
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setLoading(true);
            setSocket(ws);
        }
    },[]);
    return {
        socket,
        loading
    }

}