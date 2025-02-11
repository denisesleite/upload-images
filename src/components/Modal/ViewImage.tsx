import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent
        bgColor="gray.900"
        maxW={['300px', '500px', '900px']}
        maxH={['350px', '450px', '600px']}
        w="auto"
        height="auto"
      >
        <ModalBody p={0}>
          <Image src={imgUrl} objectFit="cover" />
        </ModalBody>

        <ModalFooter bg="gray.800" py="20px" h="2rem" borderBottomRadius="6px">
          <Link href={imgUrl} isExternal fontSize="1rem" mr="auto">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
