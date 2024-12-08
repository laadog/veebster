/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import SectionHeading from 'src/components/section-heading';
import Feature from 'src/components/cards/feature';

import icon1 from 'src/assets/images/icons/1.png';
import icon2 from 'src/assets/images/icons/2.png';
import icon3 from 'src/assets/images/icons/3.png';

const data = [
  {
    id: 1,
    icon: icon1,
    title: 'No vertification hussle',
    description: `Info collecting start at the moment of analytics tag parsing.`,
    moreLink: '',
  },
  {
    id: 2,
    icon: icon2,
    title: 'No data selling to other oranizations',
    description: `Your and your customers privacy stays in your hands.`,
    moreLink: '#',
  },
  {
    id: 3,
    icon: icon3,
    title: 'Interaction with users',
    description: `Service provides a way to interact with page visitors by giving them your chosen tasks.`,
    moreLink: '#',
  },
  {
    id: 4,
    icon: icon1,
    title: 'Individuals behaviour',
    description: `As well as overall overview, you can acces individual users actions.`,
    moreLink: '#',
  },
  {
    id: 5,
    icon: icon2,
    title: 'Simple managing',
    description: `Everything we can do, you will find from dashboard.`,
    moreLink: '#',
  },
  {
    id: 6,
    icon: icon3,
    title: 'API support',
    description: `You can also access your data by REST API requests.`,
    moreLink: '#',
  },
];

const UltimateFeatures = () => {
  return (
    <section sx={styles.section} id="services">
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Something unique about Veebster"
          description="Tools that other may not have"
        />
        <Box sx={styles.features}>
          {data?.map((item) => (
            <Feature key={item.id} className="feature-item" data={item} />
          ))}
        </Box>
      </Container>
    </section>
  );
};

export default UltimateFeatures;

const styles = {
  section: {
    pt: [12],
    pb: [6, null, null, 8, 15],
  },
  heading: {
    marginBottom: [40, 50, 60, 80],
    maxWidth: ['none', null, null, 565, null, 'none'],
  },
  features: {
    gap: [6, null, null, '90px 40px'],
    display: ['grid'],
    maxWidth: 1175,
    mx: 'auto',
    justifyContent: ['center', null, null, 'unset'],
    gridTemplateColumns: [
      'repeat(1, 300px)',
      null,
      null,
      'repeat(2, 1fr)',
      'repeat(3, 1fr)',
    ],
  },
};
