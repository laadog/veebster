/** @jsxRuntime classic */
/** @jsx jsx */
import { rgba } from 'polished';
import { jsx, Box, Container } from 'theme-ui';
import Tabs, { TabPane } from 'rc-tabs';
import SectionHeading from 'src/components/section-heading';
import Image from 'src/components/image';
import PieChart from 'src/components/icons/pie-chart';
import Map from 'src/components/icons/map';
import Users  from 'src/components/icons/users';
import Currency from 'src/components/icons/currency';
import Briefcase from 'src/components/icons/briefcase';
import TabButton from 'src/components/tabs/tab-button';
import taskManager from 'src/assets/images/task-manager.png';
import AddTask from 'src/components/icons/addtask';

const data = [
  {
    id: 1,
    title: 'Overview',
    icon: <PieChart />,
    image: taskManager,
  },
  {
    id: 2,
    title: 'Session managment',
    icon: <Users />,
    image: taskManager,
  },
  {
    id: 3,
    title: 'Geographic info',
    icon: <Map />,
    image: taskManager,
  },
  {
    id: 4,
    title: 'Task manager',
    icon: <AddTask />,
    image: taskManager,
  },
];

const Dashboard = () => {
  return (
    <section sx={styles.section}>
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Ultimate features in one dashboard"
          description="All you need to be informed about your users and to interact with individual clients"
        />
        <Tabs sx={styles.dashboardTabs} animated={{ tabPane: true }}>
          {data.map((tab) => (
            <TabPane key={tab.id} tab={<TabButton tab={tab} />}>
              <Image src={tab.image} alt={tab.title} />
            </TabPane>
          ))}
        </Tabs>
      </Container>
    </section>
  );
};

export default Dashboard;

const styles = {
  section: {
    backgroundColor: rgba('#7141F8', 0.03),
    pt: [8, null, null, 12],
    pb: [6, null, null, null, 12],
  },
  heading: {
    marginBottom: [6, null, null, 12],
    maxWidth: ['none', null, null, 565, null, 'none'],
    p: {
      color: rgba('#02073E', 0.7),
      maxWidth: 445,
    },
  },
  dashboardTabs: {
    border: 0,
    '.rc-tabs-nav-wrap': {
      justifyContent: 'center',
      marginBottom: 8,
      overflow: 'unset',
    },
    '.rc-tabs-ink-bar': {
      display: 'none',
    },
    '.rc-tabs-tabpane, .rc-tabs-tab-btn': {
      outline: 0,
    },
    '.rc-tabs-nav-list': {
      flexWrap: ['wrap', null, null, 'unset'],
    },
    '.rc-tabs-tab': {
      backgroundColor: 'transparent',
      ':nth-of-type(1),:nth-of-type(2)': {
        mb: [4, null, null, 0],
      },
      ':nth-of-type(2)': {
        ml: [4, null, null, 0],
      },
      ':nth-of-type(4)': {
        ml: [2, null, null, 0],
      },
      '+ .rc-tabs-tab': {
        ml: [null, null, null, 4, 8],
      },
    },
    '.rc-tabs-tab-active': {
      backgroundColor: 'white',
      fontWeight: [400, null, null, 500],
      boxShadow: '0px 4px 6px rgba(125, 128, 170, 0.08)',
      borderRadius: 5,
      padding: ['10px 10px', null, null, '10px 18px'],
    },
  },
};
