const parse = require('../sdp_parser.js')
const test = require('ava')

test('parse', t=> {
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

    var res = parse(s)

    t.deepEqual(res, {
     attrs: {
       sendonly: undefined,
     },
     media: [
       {
         desc: {
            type: 'audio',
            port: '5004',
            protocol: 'RTP/AVP',
            formats: ['0', '18'],
         },
         conn: {
            network_type: 'IN',
            address_type: 'IP4',
            address: '239.69.22.33/32',
         },
         attrs: {
           ptime: '1',
           rtpmap: [ '0 PCMU/8000/1', '18 G729/8000/1' ],
         },
       },
       {
         attrs: {
           channel: '814e650d-2b1b-46f2-bdfb-09e8f90272ba@speechsynth',
           cmid: '1',
           connection: 'new',
           setup: 'passsive',
         },
         desc: {
           type: 'application',
           port: '8888',
           protocol: 'TCP/MRCPv2',
           formats: ['1'],
         },
       },
     ],
   })
})
