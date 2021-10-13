import axios, { CancelTokenSource } from "axios";

export default function CancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
}
