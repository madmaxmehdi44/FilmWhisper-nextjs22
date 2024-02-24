import { GetServerSideProps } from "next";
import Head from "next/head";
import {
  Footer,
  Header,
  Hero,
  Modal,
  Row,
  Subsriptionplan,
} from "src/components";
import { IMovie, MyList, Product } from "src/interfaces/app.interface";
import { API_REQUEST } from "src/services/api.service";
import { useInfoStore } from "src/store";
import { getList } from "src/helpers/lists";

export default function Home({
  trending,
  topRated,
  tvTopRated,
  popular,
  documentary,
  family,
  history,
  comedy,
  products,
  subscription,
  list,
}: HomeProps): JSX.Element {
  const { modal } = useInfoStore();

  if (!subscription.length) return <Subsriptionplan products={products} />;

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b from-gray-900/70 to-[#010511] ${
        modal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>Home - Sammi</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      
      <Header />

      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Hero trending={trending} />
        <section>
          <Row title="Top Rated" movies={topRated} />
          <Row title="Tv Show" movies={tvTopRated} isBig={true} />
          <Row title="Comedy" movies={comedy} />
          {list.length ? <Row title="My List" movies={list} /> : null}
          <Row title="History" movies={history} />
          <Row title="Documentary" movies={documentary} />
          <Row title="Family" movies={family} />
          <Row title="Popular" movies={popular} isBig={true} />
        </section>
      </main>
      <Footer />
      {modal && <Modal />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  req,
}) => {
  const user_id = req.cookies.user_id;

  if (!user_id) {
    return {
      redirect: { destination: "/auth", permanent: false },
    };
  }

  const [
    trending,
    topRated,
    tvTopRated,
    popular,
    documentary,
    comedy,
    family,
    history,
    products,
    subscription,
  ] = await Promise.all([
    fetch(API_REQUEST.trending).then((res) => res.json()),
    fetch(API_REQUEST.top_rated).then((res) => res.json()),
    fetch(API_REQUEST.tv_top_rated).then((res) => res.json()),
    fetch(API_REQUEST.popular).then((res) => res.json()),
    fetch(API_REQUEST.documentary).then((res) => res.json()),
    fetch(API_REQUEST.comedy).then((res) => res.json()),
    fetch(API_REQUEST.family).then((res) => res.json()),
    fetch(API_REQUEST.history).then((res) => res.json()),
    fetch(API_REQUEST.products_list).then((res) => res.json()),
    fetch(`${API_REQUEST.subscription}/${user_id}`).then((res) => res.json()),
  ]);

  const myList: MyList[] = await getList(user_id);

  return {
    props: {
      trending: trending.results,
      topRated: topRated.results,
      tvTopRated: tvTopRated.results,
      popular: popular.results,
      documentary: documentary.results,
      comedy: comedy.results,
      family: family.results,
      history: history.results,
      products: products.products.data,
      subscription: subscription.subscription.data,
      list: myList.map((c) => c.product),
    },
  };
};

interface HomeProps {
  trending: IMovie[];
  topRated: IMovie[];
  tvTopRated: IMovie[];
  popular: IMovie[];
  documentary: IMovie[];
  comedy: IMovie[];
  family: IMovie[];
  history: IMovie[];
  products: Product[];
  subscription: string[];
  list: IMovie[];
}
