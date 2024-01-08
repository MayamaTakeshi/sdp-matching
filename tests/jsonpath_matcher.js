const sdp_matching = require('../index.js')
const m = require('data-matching')
const test = require('ava')

test('jsonpath_matcher', t=> {
    var s = `v=0
o=- 345678 345979 IN IP4 10.0.1.2 s=My sample redundant flow
i=2 channels: c6, c7
t=0 0
a=sendonly
m=audio 5004 RTP/AVP 0 18
c=IN IP4 239.69.22.33/32
a=rtpmap:0 PCMU/8000/1
a=rtpmap:18 G729/8000/1
a=ptime:1
m=application 8888 TCP/MRCPv2 1
a=setup:passsive
a=connection:new
a=channel:814e650d-2b1b-46f2-bdfb-09e8f90272ba@speechsynth
a=cmid:1`.replace(/\n/g, "\r\n")

    var matcher = sdp_matching.jsonpath_matcher({
        // checking a full media item
        '$.media[?(@.desc.port=="5004")]': [{
              desc: {
                type: 'audio',
                port: '5004',
                protocol: 'RTP/AVP',
                formats: ['0', '18'],
              },
              conn: {
                network_type: 'IN',
                address_type: m.collect('audio_address_type'),
                address: '239.69.22.33/32'
              },
              val_attrs: {
                ptime: '1',
                rtpmap: ['0 PCMU/8000/1', '18 G729/8000/1']
              },
            }],

        // checking a specific item value
        '$.media[?(@.desc.type=="application")].val_attrs.connection': ['new'],

        // Get MRCP channel
        '$.media[?(@.desc.port=="8888")].val_attrs.channel': [m.collect('mrcp_channel')],
    })

    var store = {}

    t.assert(matcher(s, store))

    t.is(store.audio_address_type, 'IP4')
    t.is(store.mrcp_channel, '814e650d-2b1b-46f2-bdfb-09e8f90272ba@speechsynth')
})
