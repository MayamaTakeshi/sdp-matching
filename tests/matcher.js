const sdp_matching = require("../index.js");
const m = require("data-matching");
const test = require("ava");

test("matcher", (t) => {
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
a=fake:one
a=fake:two
a=fake:three
m=application 8888 TCP/MRCPv2 1
a=setup:passsive
a=connection:new
a=channel:814e650d-2b1b-46f2-bdfb-09e8f90272ba@speechsynth
a=cmid:1`.replace(/\n/g, "\r\n");

  var matcher = sdp_matching.matcher({
    media: m.full_match([
      {
        desc: {
          type: m.collect('media0_type'),
          port: "5004",
          protocol: "RTP/!{profile_type}",
          formats: ["0", "18"],
        },
        conn: {
          network_type: "IN",
          address_type: "IP4",
          address: "239.69.22.33/32",
        },
        val_attrs: {
          rtpmap: ["0 PCMU/8000/1", "18 G729/8000/1"],
          ptime: "1",
          fake: ["one", "two", "three"],
        },
      },
      {
        desc: {
          type: m.collect('media1_type'),
          port: "8888",
          protocol: "TCP/MRCPv2",
          formats: ["1"],
        },
        val_attrs: {
          setup: "passsive",
          connection: "new",
          channel: "814e650d-2b1b-46f2-bdfb-09e8f90272ba@speechsynth",
          cmid: "1",
        },
      },
    ]),
    v: "0",
    o: "- 345678 345979 IN IP4 10.0.1.2 s=My sample redundant flow",
    i: "2 channels: c6, c7",
    t: "0 0",
    prop_attrs: ["sendonly"],
  });

  var store = {};

  t.assert(matcher(s, store));

  t.is(store.media0_type, 'audio');
  //t.is(store.media1_type, 'application');
});
