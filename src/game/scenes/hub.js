// Pure hub rules: movement, discovery and portal proximity. No DOM access here.
export const DOOR_X=[-1.96,-1.48,-1.04,-.64,.64,1.04,1.48,1.96];
export const DOOR_Y=-.60;
export const DOOR_DEPTHS=[.04,-.20,-.44,-.68,-.68,-.44,-.20,.04];
// Distance (world units) at which a revealed portal becomes "focused" and can be entered with a key.
export const NEAR_RADIUS=.15;
export const SPEED=.13;

export function advance(state,input,dt){
 const length=Math.hypot(input.x,input.y);if(!length)return {...state,moving:false,distance:0};
 const step=Math.min(Math.max(dt,0),.08)*SPEED;
 const dx=input.x/Math.max(1,length)*step,dy=input.y/Math.max(1,length)*step;
 const x=state.x+dx,y=state.y+dy;
 const reveal=dy>0?Math.max(state.reveal,Math.min(1,Math.max(0,(y-.012)/.22))):state.reveal;
 return {...state,x,y,reveal,distance:Math.hypot(dx,dy),moving:!!(dx||dy),direction:facing(input)};
}

// Diagonals read as walking into / out of the room: the side view is only used for near-horizontal motion.
export const SIDE_RATIO=3;
export function facing(input){
 return Math.abs(input.x)>Math.abs(input.y)*SIDE_RATIO?(input.x>0?'right':'left'):(input.y>0?'front':'back');
}

// Threshold point in front of each portal, where the character stands to enter.
export function threshold(i){return {x:DOOR_X[i],y:DOOR_DEPTHS[i]+.05};}

export function nearestDoor(state){
 if(!state.unlocked)return null;
 let best=null,bestDistance=NEAR_RADIUS;
 DOOR_X.forEach((_,i)=>{const t=threshold(i),d=Math.hypot(state.x-t.x,(state.y-t.y)*1.4);if(d<bestDistance){best=i;bestDistance=d;}});
 return best;
}

// Walking into the portal (moving away from the camera) at its threshold enters it.
export function enteredDoor(state){
 if(!state.unlocked||!state.moving||state.direction!=='back')return null;
 const i=DOOR_X.findIndex((x,k)=>Math.abs(x-state.x)<.075&&Math.abs(state.y-DOOR_DEPTHS[k])<.05);
 return i<0?null:i;
}

// Direction for automatic walking toward a portal; null once arrived.
// First head for a spot just in front of the portal, then walk straight in, back to the camera.
export const APPROACH=.09;
export function steerTo(state,i){
 const t=threshold(i),aligned=Math.abs(t.x-state.x)<.03;
 const goal=aligned?t:{x:t.x,y:t.y+APPROACH},dx=goal.x-state.x,dy=goal.y-state.y,d=Math.hypot(dx,dy);
 if(aligned&&d<.018)return null;
 return d<1e-6?{x:0,y:-1}:{x:dx/d,y:dy/d};
}
