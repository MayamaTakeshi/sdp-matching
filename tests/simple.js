const sdp_matching = require('../index.js')
const m = require('data-matching')
const test = require('ava')

test('simple', t=> {
    var s = `v=0
o=- 345678 345979 IN IP4 10.0.1.2 s=My sample redundant flow
i=2 channels: c6, c7
t=0 0
a=recvonly
a=group:DUP prim sec
m=audio 5004 RTP/AVP 98
c=IN IP4 239.69.22.33/32
a=rtpmap:98 L24/48000/2
a=ptime:1
a=ts-refclk:ptp=IEEE1588-2008:00-11-22-FF-FE-33-44-55:0
a=mediaclk:direct=0
a=mid:prim
m=audio 5006 RTP/AVP 98
c=IN IP4 239.69.22.33/32
a=rtpmap:98 L24/48000/2
a=ptime:1
a=ts-refclk:ptp=IEEE1588-2008:00-11-22-FF-FE-33-44-55:0
a=mediaclk:direct=0
a=mid:prim
a=recvonly
m=audio 5008 RTP/AVP 98
c=IN IP4 239.69.44.55/32
a=rtpmap:98 L24/48000/2
a=ptime:1
a=ts-refclk:ptp=IEEE1588-2008:00-11-22-FF-FE-33-44-55:0
a=mediaclk:direct=0
a=mid:sec`

    var matcher = sdp_matching({
        // checking a full media item
        '$.media[?(@.port=="5006")]': [{
              rtp: [ { payload: 98, codec: 'L24', rate: 48000, encoding: 2 } ],
              fmtp: [],
              type: 'audio',
              port: 5006,
              protocol: 'RTP/AVP',
              payloads: 98,
              connection: { version: 4, ip: '239.69.22.33/32' },
              ptime: 1,
              tsRefClocks: [
                {
                  clksrc: 'ptp',
                  clksrcExt: 'IEEE1588-2008:00-11-22-FF-FE-33-44-55:0'
                }
              ],
              mediaClk: { mediaClockName: 'direct', mediaClockValue: 0 },
              mid: m.collect('mid'),
              direction: m.collect('direction'),
            }],

        // checking a specific item value
        '$.media[?(@.port=="5006")].direction': ['recvonly'],
    })

    var store = {}

    t.assert(matcher(s, store))

    t.assert(store.mid == 'prim')
    t.assert(store.direction == 'recvonly')
})
