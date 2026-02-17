import { useDisclosure, useToast } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import {
  CloseIcon,
  HamburgerIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import api from "@/api";
import modelOptions from "@/modelOptions.json";
import AuthContext from "../context/AuthContext";
import { CiChat1, CiLogout } from "react-icons/ci";
import { MdOutlineHistory, MdOutlineQueryStats } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const toastOptions = {
  position: "top",
  variant: "subtle",
  duration: 3000,
  isClosable: true,
};

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
          variant="solid"
          colorScheme="teal"
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
          variant="ghost"
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

const ModelSelectionModal = ({ isOpen, onClose, model, setModel }) => {
  const [customModelInput, setCustomModelInput] = useState(model);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) setCustomModelInput(model);
  }, [isOpen, model]);

  const handleSetCustomModel = () => {
    if (customModelInput.trim()) {
      setModel(customModelInput.trim());
      onClose();
    }
  };

  const visibleModels = modelOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="80vh" display="flex" flexDirection="column">
        <ModalHeader>Pilih Model AI</ModalHeader>
        <ModalCloseButton />
        <Box p={6} pb={4}>
          <VStack align="stretch" spacing={4}>
            <Input
              placeholder="Cari model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <HStack>
              <Input
                placeholder="atau masukkan model kustom di sini..."
                value={customModelInput}
                onChange={(e) => setCustomModelInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetCustomModel()}
              />
              <Button colorScheme="teal" onClick={handleSetCustomModel}>
                Set
              </Button>
            </HStack>
          </VStack>
        </Box>
        <Divider />
        <ModalBody p={6} pt={4} overflowY="auto">
          <VStack align="stretch" spacing={2}>
            {visibleModels.map((option, i) => (
              <Button
                key={i}
                variant={model === option.value ? "solid" : "ghost"}
                colorScheme={model === option.value ? "teal" : "gray"}
                justifyContent="space-between"
                w="full"
                onClick={() => {
                  setModel(option.value);
                  onClose();
                }}
              >
                <HStack spacing={3}>
                  <Icon as={SettingsIcon} />
                  <Text textAlign="left" fontWeight="normal">
                    {option.label}
                  </Text>
                </HStack>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const RightSidebarContent = ({
  type,
  setType,
  difficulty,
  setDifficulty,
  language,
  setLanguage,
  total,
  setTotal,
  model,
  setModel,
  pages,
  setPages,
  onCollapse,
  isThesisMode,
  setIsThesisMode,
}) => {
  const selectedType = typeOptions.find((o) => o.value === type);
  const selectedDifficulty = difficultyOptions.find(
    (o) => o.value === difficulty,
  );
  const selectedLanguage = languageOptions.find((o) => o.value === language);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const findModelLabel = (modelValue) =>
    modelOptions.find((o) => o.value === modelValue)?.label || modelValue;

  return (
    <VStack align="stretch" spacing={4}>
      <Flex justify="space-between" align="center">
        <Heading size="md" color="gray.700">
          Pengaturan
        </Heading>
        {onCollapse && (
          <IconButton
            icon={<CloseIcon />}
            onClick={onCollapse}
            aria-label="Tutup Pengaturan"
            size="sm"
            variant="ghost"
            display={{ base: "none", lg: "inline-flex" }}
          />
        )}
      </Flex>
      <FormControl>
        <FormLabel fontSize="sm">Tipe Soal</FormLabel>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            fontWeight="normal"
            w="full"
            textAlign="left"
            size="sm"
          >
            <HStack spacing={2}>
              <Icon as={selectedType?.icon} boxSize="16px" />
              <Text>{selectedType?.label}</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            {typeOptions.map((item, i) => (
              <MenuItem
                key={i}
                icon={<Icon as={item.icon} boxSize="16px" />}
                onClick={() => setType(item.value)}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="purple.50"
        p={2}
        borderRadius="md"
        borderWidth={isThesisMode ? 1 : 0}
        borderColor="purple.200"
      >
        <Box>
          <FormLabel
            htmlFor="thesis-mode"
            mb="0"
            fontSize="sm"
            fontWeight="bold"
            color="purple.700"
          >
            Mode Structured
          </FormLabel>
          <FormHelperText fontSize="xs" mt={0} color="purple.600">
            Campuran (40:30:30)
          </FormHelperText>
        </Box>
        <Switch
          id="thesis-mode"
          colorScheme="purple"
          isChecked={isThesisMode}
          onChange={(e) => setIsThesisMode(e.target.checked)}
        />
      </FormControl>

      {!isThesisMode && (
        <FormControl>
          <FormLabel fontSize="sm">Tingkat Kesulitan</FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="outline"
              fontWeight="normal"
              w="full"
              textAlign="left"
              size="sm"
            >
              <HStack spacing={2}>
                <Icon as={selectedDifficulty?.icon} boxSize="16px" />
                <Text>{selectedDifficulty?.label}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              {difficultyOptions.map((item, i) => (
                <MenuItem
                  key={i}
                  icon={<Icon as={item.icon} boxSize="16px" />}
                  onClick={() => setDifficulty(item.value)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>
      )}

      <FormControl>
        <FormLabel fontSize="sm">Bahasa</FormLabel>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            fontWeight="normal"
            w="full"
            textAlign="left"
            size="sm"
          >
            <HStack spacing={2}>
              <Icon
                as={selectedLanguage?.icon}
                boxSize="20px"
                borderRadius="sm"
              />
              <Text>{selectedLanguage?.label}</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            {languageOptions.map((item, i) => (
              <MenuItem
                key={i}
                icon={<Icon as={item.icon} boxSize="20px" borderRadius="sm" />}
                onClick={() => setLanguage(item.value)}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="sm">Banyak Soal</FormLabel>
        <NumberInput
          size="sm"
          value={total}
          onChange={(_, vNum) => setTotal(vNum)}
          min={1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="sm">Pilih Halaman (Maks. 10)</FormLabel>
        <Input
          size="sm"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="Contoh: 1-3, 5, 8"
        />
        <FormHelperText fontSize="xs">
          Gunakan koma (,) dan tanda hubung (-).
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="sm">Model AI</FormLabel>
        <Button
          onClick={onOpen}
          variant="outline"
          fontWeight="normal"
          w="full"
          textAlign="left"
          size="sm"
          justifyContent="space-between"
        >
          <HStack spacing={2} flex="1" minW="0">
            <Icon as={SettingsIcon} boxSize="16px" />
            <Text noOfLines={1} title={findModelLabel(model)}>
              {findModelLabel(model)}
            </Text>
          </HStack>
          <ChevronDownIcon />
        </Button>
      </FormControl>
      <ModelSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        model={model}
        setModel={setModel}
      />
    </VStack>
  );
};

function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("multiple-choice");
  const [difficulty, setDifficulty] = useState("mots");
  const [language, setLanguage] = useState("Indonesia");
  const [total, setTotal] = useState(5);
  const [model, setModel] = useState(
    localStorage.getItem("selectedModel") || modelOptions[0].value,
  );
  const [keywords, setKeywords] = useState("");
  const [pages, setPages] = useState("1-5");
  const [isThesisMode, setIsThesisMode] = useState(false);
  const toast = useToast();
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const { user, logout, updateUserCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    isOpen: isLeftDrawerOpen,
    onOpen: onLeftDrawerOpen,
    onClose: onLeftDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isRightDrawerOpen,
    onOpen: onRightDrawerOpen,
    onClose: onRightDrawerClose,
  } = useDisclosure();

  useEffect(() => {
    localStorage.setItem("selectedModel", model);
  }, [model]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setFile(null);
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
      }
      toast({ title: "Logout berhasil", status: "success", ...toastOptions });
      navigate("/login");
      setIsLoggingOut(false);
    }, 700);
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setGenerationError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("type", type);

    const finalDifficulty = isThesisMode ? "mixed" : difficulty;
    formData.append("difficulty", finalDifficulty);

    formData.append("language", language);
    formData.append("total", total);
    formData.append("model", model);
    formData.append("keywords", keywords);
    formData.append("pages", pages);

    try {
      const response = await api.post(`/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUserCount(response.data.generation_count);
      toast({
        ...toastOptions,
        title: "Sesi berhasil dibuat!",
        description: `Anda akan diarahkan ke halaman hasil.`,
        status: "success",
      });
      navigate(`/c/${response.data.sessionId}`);
    } catch (e) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.error?.message ||
        e?.response?.data?.error ||
        "Terjadi kesalahan";
      setGenerationError(errorMessage);
      toast({
        ...toastOptions,
        title: "Gagal membuat soal",
        description: errorMessage,
        status: "error",
      });
      setLoading(false);
    }
  }, [
    file,
    type,
    difficulty,
    language,
    total,
    model,
    keywords,
    pages,
    toast,
    updateUserCount,
    navigate,
    isThesisMode,
  ]);

  const handleGenerateClick = () => {
    if (!user) {
      toast({
        ...toastOptions,
        title: "Harap login terlebih dahulu",
        description: "Anda akan diarahkan ke halaman login.",
        status: "warning",
      });
      navigate("/login");
    } else {
      handleUpload();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        if (file && !loading) {
          event.preventDefault();
          handleGenerateClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, loading, handleGenerateClick]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const pdf = acceptedFiles.find((f) => f.type === "application/pdf");
      if (!pdf) {
        toast({ ...toastOptions, title: "File harus PDF", status: "error" });
        return;
      }
      setFile(pdf);
      setFileUrl(URL.createObjectURL(pdf));
      setGenerationError(null);
      toast({
        ...toastOptions,
        title: "File diterima",
        description: pdf.name,
        status: "success",
        duration: 1500,
      });
    },
    [toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    setGenerationError(null);
  };

  const rightSidebarProps = {
    type,
    setType,
    difficulty,
    setDifficulty,
    language,
    setLanguage,
    total,
    setTotal,
    model,
    setModel,
    pages,
    setPages,
    isThesisMode,
    setIsThesisMode,
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
                AIsoal
              </Heading>
              <IconButton
                icon={<SettingsIcon />}
                onClick={onRightDrawerOpen}
                aria-label="Buka Pengaturan"
                variant="ghost"
              />
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
              <HStack spacing={2}>
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
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  color="gray.600"
                  w="200px"
                  noOfLines={1}
                >
                  {file ? file.name : "Belum ada file diunggah"}
                </Text>
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
            <Box flex="1" p={{ base: 4, md: 6 }} overflow="hidden">
              <Box h="100%" w="100%" overflowY="auto">
                <Flex
                  align="center"
                  justify="center"
                  h="100%"
                  color="gray.400"
                  textAlign="center"
                  direction="column"
                >
                  <Heading size="lg" mb={2}>
                    Selamat Datang di AIsoal!
                  </Heading>
                  <Text>Unggah file PDF Anda di bawah untuk memulai.</Text>
                  <Text>Hasil generate soal akan muncul di halaman baru.</Text>
                </Flex>
              </Box>
            </Box>
            <Box
              p={{ base: 3, md: 4 }}
              borderTop="1px solid"
              borderColor="gray.200"
              bg="white"
              boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
            >
              <VStack spacing={3}>
                {generationError && (
                  <Alert status="error" borderRadius="md" variant="subtle">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle>Gagal Membuat Soal</AlertTitle>
                      <AlertDescription display="block">
                        {generationError}
                      </AlertDescription>
                    </Box>
                    <CloseButton
                      alignSelf="flex-start"
                      position="relative"
                      right={-1}
                      top={-1}
                      onClick={() => setGenerationError(null)}
                    />
                  </Alert>
                )}
                <Box
                  {...getRootProps()}
                  w="full"
                  position="relative"
                  border="2px dashed"
                  borderColor={isDragActive ? "teal.500" : "gray.300"}
                  borderRadius="lg"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="54px"
                  bg={isDragActive ? "teal.50" : "gray.50"}
                  cursor="pointer"
                  transition="all 0.2s ease-in-out"
                >
                  <input {...getInputProps()} />
                  <Box px={file ? 8 : 0}>
                    {file && fileUrl ? (
                      <Link
                        fontSize="sm"
                        fontWeight="medium"
                        color="teal.600"
                        href={fileUrl}
                        isExternal
                        onClick={(e) => e.stopPropagation()}
                        noOfLines={1}
                        title={file.name}
                      >
                        ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </Link>
                    ) : (
                      <Text fontWeight="medium" color="gray.600" fontSize="sm">
                        {isDragActive
                          ? "Lepaskan file PDF..."
                          : "Tarik atau pilih file PDF untuk memulai"}
                      </Text>
                    )}
                  </Box>
                  {file && (
                    <IconButton
                      icon={<CloseIcon boxSize={2} />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      aria-label="Hapus file"
                      position="absolute"
                      top="50%"
                      right="12px"
                      transform="translateY(-50%)"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    />
                  )}
                </Box>
                <HStack w="full" spacing={3}>
                  <Input
                    size="sm"
                    borderRadius="md"
                    placeholder="Tambahkan keywords (opsional), pisahkan dengan koma"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    autoComplete="off"
                    isDisabled={!file || loading}
                  />
                  <Button
                    colorScheme="teal"
                    onClick={handleGenerateClick}
                    isDisabled={!file || loading}
                    size="sm"
                    w="180px"
                    flexShrink={0}
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <HStack spacing={2}>
                        <Text>Generate Soal</Text>
                        <HStack spacing={1}>
                          <Kbd
                            sx={{
                              bg: "gray.700",
                              color: "white",
                              px: "6px",
                              py: "2px",
                              borderRadius: "md",
                              fontSize: "xs",
                            }}
                          >
                            Ctrl
                          </Kbd>
                          <Kbd
                            sx={{
                              bg: "gray.700",
                              color: "white",
                              px: "6px",
                              py: "2px",
                              borderRadius: "md",
                              fontSize: "xs",
                            }}
                          >
                            ↵
                          </Kbd>
                        </HStack>
                      </HStack>
                    )}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Flex>
        </GridItem>
        <GridItem
          as="aside"
          p={isRightSidebarCollapsed ? 0 : 5}
          borderLeft="1px solid"
          borderColor="gray.200"
          overflowY="auto"
          h="100vh"
          display={{ base: "none", lg: "block" }}
          overflowX="hidden"
          whiteSpace="nowrap"
          transition="padding 0.3s ease-in-out"
        >
          <Box
            visibility={isRightSidebarCollapsed ? "hidden" : "visible"}
            opacity={isRightSidebarCollapsed ? 0 : 1}
            transition="opacity 0.2s ease-in-out, visibility 0.2s ease-in-out"
          >
            <RightSidebarContent
              {...rightSidebarProps}
              onCollapse={() => setIsRightSidebarCollapsed(true)}
            />
          </Box>
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
        <Drawer
          placement="right"
          onClose={onRightDrawerClose}
          isOpen={isRightDrawerOpen}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody mt={6}>
              <RightSidebarContent {...rightSidebarProps} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Grid>
    </>
  );
}

export default App;
