const parse = (s) => {
    var session = {
        attrs: {},
        media: [],
    }
    
    var lines = s.split("\r\n")
    var target = session
    lines.forEach(line => {
        var tokens = line.split("=")
        var type = tokens[0]
        var val = tokens[1]
        if(type == "m") {
            var med = val.split(" ")
            target = {
                desc: {
                    type: med[0],
                    port: med[1],
                    protocol: med[2],
                    formats: med.slice(3),
                },
                'attrs': {},
            }
            session.media.push(target)
        } else if(type == 'a') {
            var tokens = val.split(":")
            var id = tokens[0]
            var v = tokens[1] 
            if(id == 'rtpmap') {
                if(target.attrs.rtpmap) {
                    target.attrs.rtpmap.push(v)
                } else {
                    target.attrs.rtpmap = [v]
                }
            } else {
                target.attrs[id] = v
            }
        } else if(type == 'c') {
            var c = val.split(" ")
            target.conn = {
                network_type: c[0],
                address_type: c[1],
                address: c[2],
            }
        }
    })

    return session
}

module.exports = parse
