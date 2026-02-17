import { useDisclosure } from "@chakra-ui/react";
import {
  HamburgerIcon,
  SettingsIcon,
  DownloadIcon,
  CheckCircleIcon,
  ArrowForwardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import AuthContext from "../../context/AuthContext";
import { CiChat1, CiLogout } from "react-icons/ci";
import { MdOutlineHistory, MdOutlineQueryStats } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const LeftSidebarContent = ({ user, onLogoutClick, isLoggingOut }) => (
  <VStack align="stretch" spacing={4} h="full">
    <Box flex="1">
      <Heading size="md" color="teal.700">
        📄 AIsoal
      </Heading>
      <VStack align="stretch" spacing={2} mt={6}>
        <Button
          as={RouterLink}
          to="/"
          justifyContent="flex-start"
          variant="ghost"
          leftIcon={<Icon as={CiChat1} />}
        >
          New
        </Button>
        {user && (
          <>
            <Button
              as={RouterLink}
              to="/stats"
              justifyContent="flex-start"
              variant="ghost"
              leftIcon={<Icon as={MdOutlineQueryStats} />}
            >
              Stats
            </Button>
            <Button
              as={RouterLink}
              to="/history"
              justifyContent="flex-start"
              variant="ghost"
              leftIcon={<Icon as={MdOutlineHistory} />}
            >
              Riwayat
            </Button>
          </>
        )}
        <Button
          as={RouterLink}
          to="/about"
          justifyContent="flex-start"
          variant="solid"
          colorScheme="teal"
          leftIcon={<Icon as={IoMdInformationCircleOutline} />}
        >
          About
        </Button>
      </VStack>
    </Box>
    {user && (
      <Box>
        <Divider my={4} />
        <Text fontSize="sm" noOfLines={1} title={user.email}>
          {user.email}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Generasi: {user.generation_count} / 5
        </Text>
        <Button
          mt={3}
          w="full"
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          size="sm"
          leftIcon={<Icon as={CiLogout} />}
          onClick={onLogoutClick}
          isLoading={isLoggingOut}
        >
          Logout
        </Button>
      </Box>
    )}
  </VStack>
);

const ContentCard = ({ children, ...props }) => (
  <Box
    bg="white"
    p={{ base: 5, md: 6 }}
    borderRadius="2xl"
    borderWidth={1}
    borderColor="gray.200"
    shadow="xs"
    {...props}
  >
    {children}
  </Box>
);

const FeatureItem = ({ icon, title, children }) => (
  <VStack
    align="stretch"
    spacing={3}
    p={5}
    bg="gray.50"
    borderRadius="xl"
    borderWidth={1}
    borderColor="gray.200"
  >
    <HStack spacing={3}>
      <Flex
        align="center"
        justify="center"
        bg="teal.100"
        borderRadius="lg"
        boxSize="40px"
        flexShrink={0}
      >
        <Icon as={icon} color="teal.600" boxSize="20px" />
      </Flex>
      <Text fontWeight="bold" color="gray.800">
        {title}
      </Text>
    </HStack>
    <Text fontSize="sm" color="gray.600" pl="52px">
      {children}
    </Text>
  </VStack>
);

function AboutPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);

  const {
    isOpen: isLeftDrawerOpen,
    onOpen: onLeftDrawerOpen,
    onClose: onLeftDrawerClose,
  } = useDisclosure();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
      setIsLoggingOut(false);
    }, 700);
  };

  const gridTemplateColumns = {
    base: "1fr",
    lg: `${isLeftSidebarCollapsed ? "0px" : "220px"} 1fr ${
      isRightSidebarCollapsed ? "0px" : "320px"
    }`,
  };

  return (
    <>
      {isLoggingOut && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="whiteAlpha.800"
          align="center"
          justify="center"
          zIndex="tooltip"
          transition="background-color 0.3s ease-in-out"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
        </Flex>
      )}
      <Grid
        templateColumns={gridTemplateColumns}
        h="100vh"
        w="100vw"
        overflow="hidden"
        transition="grid-template-columns 0.3s ease-in-out"
      >
        <GridItem
          as="aside"
          p={isLeftSidebarCollapsed ? 0 : 5}
          borderRight="1px solid"
          borderColor="gray.200"
          display={{ base: "none", lg: "block" }}
          overflow="hidden"
          whiteSpace="nowrap"
          transition="padding 0.3s ease-in-out"
        >
          <Box
            visibility={isLeftSidebarCollapsed ? "hidden" : "visible"}
            opacity={isLeftSidebarCollapsed ? 0 : 1}
            transition="opacity 0.2s ease-in-out, visibility 0.2s ease-in-out"
          >
            <LeftSidebarContent
              user={user}
              onLogoutClick={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </Box>
        </GridItem>

        <GridItem as="main" h="100vh" position="relative">
          <Flex direction="column" h="100%" bg="gray.50">
            <Flex
              justify="space-between"
              align="center"
              p={4}
              display={{ base: "flex", lg: "none" }}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="white"
            >
              <IconButton
                icon={<HamburgerIcon />}
                onClick={onLeftDrawerOpen}
                aria-label="Buka Menu"
                variant="ghost"
              />
              <Heading size="md" color="teal.700">
                Tentang AIsoal
              </Heading>
              <Box w="40px" />
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              p={3}
              px={4}
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              position="sticky"
              top="0"
              zIndex="1"
            >
              <HStack>
                <IconButton
                  display={{ base: "none", lg: "inline-flex" }}
                  icon={
                    isLeftSidebarCollapsed ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )
                  }
                  onClick={() =>
                    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)
                  }
                  aria-label="Toggle Sidebar Kiri"
                  size="sm"
                  variant="ghost"
                />
                <Heading size="sm" color="gray.700">
                  About
                </Heading>
              </HStack>
              <HStack spacing={3}>
                <ScaleFade in={isRightSidebarCollapsed} unmountOnExit>
                  <IconButton
                    display={{ base: "none", lg: "inline-flex" }}
                    icon={<SettingsIcon />}
                    onClick={() => setIsRightSidebarCollapsed(false)}
                    aria-label="Buka Pengaturan"
                    size="sm"
                    variant="ghost"
                  />
                </ScaleFade>
              </HStack>
            </Flex>

            <Box flex="1" p={{ base: 4, md: 6 }} overflowY="auto">
              <VStack spacing={6} align="stretch">
                <ContentCard>
                  <VStack spacing={3} align="stretch">
                    <Heading as="h1" size="lg" color="gray.800">
                      Selamat Datang di AIsoal
                    </Heading>
                    <Text color="gray.600" lineHeight="tall" maxW="4xl">
                      AIsoal adalah sebuah aplikasi web inovatif yang dirancang
                      untuk membantu guru, dosen, dan pembuat konten pendidikan
                      dalam membuat soal berkualitas dari materi PDF secara
                      otomatis. Dengan memanfaatkan kekuatan kecerdasan buatan
                      (AI), kami mengubah proses yang memakan waktu menjadi
                      tugas yang cepat, efisien, dan menyenangkan.
                    </Text>
                  </VStack>
                </ContentCard>

                <ContentCard>
                  <VStack spacing={5} align="stretch">
                    <Heading as="h2" size="md" color="gray.700">
                      Fitur Utama
                    </Heading>
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
                      <FeatureItem
                        icon={ArrowForwardIcon}
                        title="Pembuatan Soal Otomatis"
                      >
                        Unggah materi dalam format PDF, dan biarkan AI kami
                        menganalisis dan membuat berbagai jenis soal yang
                        relevan.
                      </FeatureItem>
                      <FeatureItem
                        icon={SettingsIcon}
                        title="Kustomisasi Penuh"
                      >
                        Pilih jenis soal, tingkat kesulitan, dan jumlah soal
                        yang ingin Anda hasilkan sesuai kebutuhan.
                      </FeatureItem>
                      <FeatureItem
                        icon={CheckCircleIcon}
                        title="Model AI Terkini"
                      >
                        Akses berbagai model AI terkemuka melalui OpenRouter
                        untuk memastikan kualitas soal terbaik.
                      </FeatureItem>
                      <FeatureItem
                        icon={DownloadIcon}
                        title="Ekspor ke Berbagai Format"
                      >
                        Unduh soal yang sudah jadi dalam format DOCX, PDF, TXT,
                        dan lainnya, siap untuk digunakan.
                      </FeatureItem>
                    </SimpleGrid>
                  </VStack>
                </ContentCard>

                <ContentCard>
                  <VStack spacing={4} align="stretch">
                    <Heading as="h2" size="md" color="gray.700">
                      Teknologi yang Digunakan
                    </Heading>
                    <Text color="gray.600">
                      AIsoal dibangun di atas tumpukan teknologi modern untuk
                      memberikan pengalaman terbaik bagi pengguna.
                    </Text>
                    <Wrap spacing={2} pt={2}>
                      <Badge colorScheme="blue" p={2} borderRadius="md">
                        React
                      </Badge>
                      <Badge colorScheme="teal" p={2} borderRadius="md">
                        Chakra UI
                      </Badge>
                      <Badge colorScheme="purple" p={2} borderRadius="md">
                        OpenRouter API
                      </Badge>
                      <Badge colorScheme="green" p={2} borderRadius="md">
                        Node.js
                      </Badge>
                      <Badge colorScheme="orange" p={2} borderRadius="md">
                        Axios
                      </Badge>
                      <Badge colorScheme="gray" p={2} borderRadius="md">
                        Express
                      </Badge>
                    </Wrap>
                  </VStack>
                </ContentCard>

                <Box
                  textAlign="center"
                  pt={4}
                  pb={4}
                  color="gray.500"
                  fontSize="sm"
                >
                  <Text>
                    Punya masukan atau pertanyaan? Hubungi kami di{" "}
                    <Link
                      href="mailto:mail@aisoal.my.id"
                      color="teal.500"
                      fontWeight="medium"
                    >
                      mail@aisoal.my.id
                    </Link>
                  </Text>
                  <Text mt={2}>AIsoal v1.0.0</Text>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </GridItem>

        <GridItem
          as="aside"
          p={0}
          borderLeft="1px solid"
          borderColor="gray.200"
          display={{ base: "none", lg: "block" }}
        >
          {/* Empty placeholder for right sidebar */}
        </GridItem>

        <Drawer
          placement="left"
          onClose={onLeftDrawerClose}
          isOpen={isLeftDrawerOpen}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody mt={6}>
              <LeftSidebarContent
                user={user}
                onLogoutClick={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Grid>
    </>
  );
}

export default AboutPage;
