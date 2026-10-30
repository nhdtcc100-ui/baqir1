import bcrypt from 'bcryptjs';

const main = async () => {
  const h1 = await bcrypt.hash('admin123456', 10);
  const h2 = await bcrypt.hash('rep123456', 10);
  console.log('ADMIN_HASH=' + h1);
  console.log('REP_HASH=' + h2);
};
main();
