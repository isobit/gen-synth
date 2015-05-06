function createXHR(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}
class HTTPResponse {
    constructor(xhr) {
        this.status = xhr.status;
        this.headers = {
            get: function(name) {
                return xhr.getResponseHeader(name);
            }
        };
        var self = this;
        this.data = function() {
            let contentType = self.headers.get('Content-Type');
            if (contentType && typeof contentType === 'string' && contentType.indexOf('json') != -1)
                return JSON.parse(xhr.responseText);
            else
                return xhr.response;
        }();
        this.xhr = xhr;
    }
}
class HTTP {
    request(method, url, data) {
        return new Promise((resolve, reject) => {
            let req = createXHR(method, url);
            req.addEventListener('load', function() {
                let res = new HTTPResponse(this);
                if (res.status == 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
            req.addEventListener('error', function() {
                reject(new HTTPResponse(this));
            });
            if (data) {
                req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                req.send(JSON.stringify(data));
            } else {
                req.send();
            }
        });
    }
    get(url) {
        return this.request('GET', url);
    }
    post(url, data) {
        return this.request('POST', url, data);
    }
    put(url, data) {
        return this.request('PUT', url, data);
    }
    delete(url) {
        return this.request('DELETE', url);
    }
}

export default new HTTP();