export const generateTransactionCode = async (collegeCode, module, Model) => {

// module = {canteen = C} {library = L}
// model = schema model so the we can use (.find)

  const now = new Date();

  const day   = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year  = String(now.getFullYear()).slice(-2);

  const dateStr = `${day}${month}${year}`;

  // Find last transaction of today
  const lastTxn = await Model.findOne({
    transactionCode: { $regex: `^${collegeCode}${module}${dateStr}` }
  })
  .sort({ transactionCode: -1 });

  let nextNumber = 1;

  if (lastTxn) {
    const lastSeq = parseInt(lastTxn.transactionCode.slice(-3));
    nextNumber = lastSeq + 1;
  }

  const running = String(nextNumber).padStart(3, "0");

  return `${collegeCode}${module}${dateStr}${running}`;
};
