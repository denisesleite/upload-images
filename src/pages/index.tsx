import { Button, Box } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  id: string;
  ts: number;
};

type GetImagesResponse = {
  after: string;
  data: Image[];
};

export default function Home(): JSX.Element {
  const observer = useRef<IntersectionObserver>();

  const fetchImages = async ({
    pageParam = null,
  }): Promise<GetImagesResponse> => {
    const response = await api.get(`/api/images`, {
      // pega as imagens do banco fauna
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: fetchImages, // TODO AXIOS REQUEST WITH PARAM
    getNextPageParam: lastPage => {
      return lastPage.after || null;
    }, // TODO GET AND RETURN NEXT PAGE PARAM
  });

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const newData = data?.pages.map(page => page.data).flat();

    return newData;
  }, [data]);

  const lastElementRef = useCallback(
    (element: HTMLButtonElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        console.log('entries', entries);
        if (entries[0].isIntersecting && hasNextPage) {
          // valida se tem o elemento na tela, se tem próxima página e se nao tiver fazendo fetching de dados
          fetchNextPage();
        }
      });

      if (element) observer.current.observe(element);
    },
    [fetchNextPage, hasNextPage, isLoading]
  );

  // TODO RENDER LOADING SCREEN
  if (isLoading && !isError) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button
            ref={lastElementRef}
            mt={5}
            // onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
