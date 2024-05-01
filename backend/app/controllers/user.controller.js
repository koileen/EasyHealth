exports.allAccess = (req, res) => {
    res.status(200).json({ message: "Public Content" });
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).json({ message: "User Content." });
  };
  
  exports.medicalBoard = (req, res) => {
    res.status(200).json({ message: "Medical Content." });
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).json({ message: "Admin Content." });
  };