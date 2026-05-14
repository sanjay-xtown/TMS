import { comparePassword } from '../src/shared/auth/bcrypt.js';

async function testPasswords() {
  const tests = [
    { name: 'Edwin Raj', mobile: '9597522458', hash: '$2b$10$zVusVQKsRV7cFCEk/NBijOODrRLuKuRC1VH.MgCUjUXz04GDTJZWy', expected: '2458' },
    { name: 'Pavi', mobile: '7305217401', hash: '$2b$10$/fGe3xG0T6UFHH/dTpeAqeWIc1qWegM5g5lDNLlv9Jit9uX46sgsS', expected: '7401' },
    { name: 'Ajay', mobile: '7896969696', hash: '$2b$10$FkQRCAvrQ/kCaaOMrZxjPOusfPTK3gwiQiwpexAGhP9z6Hq9DfG8.', expected: '9696' },
    { name: 'Ravisankar', mobile: '9876543210', hash: '$2b$10$mSd2wpxCURZA7s5V2Lq6H.SAHpYqoSue3OpMoQYFUSVwoSC4aW0UC', expected: '3210' },
  ];

  for (const t of tests) {
    const isMatch = await comparePassword(t.expected, t.hash);
    console.log(`${t.name} (${t.mobile}): Expected "${t.expected}" -> Match: ${isMatch}`);
  }
}

testPasswords();
