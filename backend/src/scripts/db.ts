import axios from 'axios';

const command = process.argv[2];
const baseURL = 'http://localhost:4000'; // Adjust if needed

(async () => {
  try {
    switch (command) {
      case 'seed':
        await axios.post(`${baseURL}/reset`);
        console.log('✅ Database seeded via API');
        break;
      case 'clear':
        await axios.post(`${baseURL}/clear`);
        console.log('🧹 Database reset via API');
        break;
      default:
        console.error('❌ Unknown command. Use: seed or clear');
    }
  } catch (error: any) {
    console.error('❌ Error communicating with server:', error.message);
    process.exit(1);
  }
})();
