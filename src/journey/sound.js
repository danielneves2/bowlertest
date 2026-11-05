// Original synthesized cues, CC0-1.0. No recording, sample, microphone or network.
let audio=null,enabled=false;
export async function setSound(value){enabled=value;if(value){try{audio||=new (window.AudioContext||window.webkitAudioContext)();await audio.resume();}catch{enabled=false;}}return enabled;}
export function cue(kind='key'){
 if(!enabled||!audio||document.hidden)return;
 const now=audio.currentTime,gain=audio.createGain();gain.connect(audio.destination);
 if(kind==='paper'||kind==='wind'){
  const duration=kind==='wind'?.75:.09,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);let seed=1747;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=kind==='wind'?430:1600;filter.Q.value=.6;source.connect(filter);filter.connect(gain);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.022,now+duration*.2);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};return;
 }
 const osc=audio.createOscillator();osc.connect(gain);
 const finish=kind==='finish';osc.type='sine';osc.frequency.setValueAtTime(finish?523:260,now);osc.frequency.exponentialRampToValueAtTime(finish?784:130,now+.12);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.035,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+(finish?.6:.18));osc.start(now);osc.stop(now+(finish?.65:.2));osc.onended=()=>{osc.disconnect();gain.disconnect();};
}
