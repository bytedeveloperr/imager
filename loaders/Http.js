import http from "http"

class Http {

	server(opt) {
		return http.createServer(opt)
	}
}

export default Http