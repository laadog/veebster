/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box, Container, Button } from 'theme-ui';
import Masonry from 'react-masonry-component';
import SectionHeading from 'src/components/section-heading';
import FaqItem from 'src/components/cards/faq-item';

const data = [
  {
    id: 1,
    ques: 'Is this free of charge?',
    ans: `Standard option is free of charge, we have not figured out our premium plans yet.`,
  },
  {
    id: 2,
    ques: 'Are the number of analyzed pages limited?',
    ans: `No, submit all the pages you like.`,
  },
  {
    id: 3,
    ques: 'Can website traffic be faked?',
    ans: `Yes, but our service can exclude addressed that may me faking requests by your choice.`,
  },
  {
    id: 4,
    ques: 'Can I delete info collected by service?',
    ans: `This option will be implemented near future.`,
  }

];

const masonryOptions = { originTop: true };

const Faq = () => {
  return (
    <section id="faq" sx={styles.section}>
      <Container>
        <SectionHeading
          sx={{ mb: [8, null, null, 15] }}
          description="Get your question answered"
          title="If you need some extra knowledge about service"
        />
        <Masonry options={masonryOptions} sx={styles.grid}>
          {data.map((item) => {
            return <FaqItem key={item.id} faq={item} className="faq-item" />;
          })}
        </Masonry>
        <Box sx={styles.loadMore}>
          <Button variant="text">Still Question? Contact us</Button>
        </Box>
      </Container>
    </section>
  );
};

export default Faq;

const styles = {
  section: {
    pt: [6, null, null, null, 10, 14],
    pb: [10, null, null, 7, null, 14, 17],
  },
  grid: {
    mx: [null, null, null, -6, -8, 'unset'],
  },
  loadMore: {
    paddingTop: [null, null, null, 3],
    textAlign: 'center',
    button: {
      backgroundColor: '#ECF2F7',
      color: '#738295',
      minHeight: 50,
      px: '22px',
      ':hover': {
        backgroundColor: 'primary',
        color: 'white',
      },
    },
  },
};
