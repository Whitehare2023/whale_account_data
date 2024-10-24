import Navbar from "../common/Navbar";
import Advantage from "../views/advantage";
import Faqs from "../views/faqs";
import Footer from "../views/footer";
import Hero from "../views/hero";
import JoinUs from "../views/joinUs";
import NyxCipher from "../views/nyxCipher";
import NyxToolkit from "../views/nyxToolkit";
import NyxVsPaal from "../views/nyxVsPaal";
import Partnering from "../views/partnering";
import CronJobWithData from './CronJobWithData'; // 导入监控组件

function Home() {

  return (
    <div id='home'>
      <Navbar />
      <Hero />
      <NyxCipher />
      <Advantage />
      <NyxToolkit />
      <NyxVsPaal />
      <Partnering />
      <JoinUs />
      <Faqs />
      <Footer />

      <div style={{ marginTop: '50px' }}>
        <CronJobWithData />
      </div>
    </div>
  );
}

export default Home;
