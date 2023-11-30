
export function
    checkUserRole(allowedUser){
        
     return (req,res,next)=>{
  const user=req.user;
  if(!user){
    return res.status(401).json({error:true,message:"Unauthorised"});
  }
  const userRole=user.role;
  if(!allowedUser.includes(userRole)){
    return res.status(403).json({message:'Access denied. Insufficient role'});
  }
  next();
    }
    }
