import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  DownloadIcon,
  HamburgerIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  CheckCircleIcon,
  NotAllowedIcon,
  ChevronDownIcon,
  CloseIcon,
  EditIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import api from "@/api";
import AuthContext from "../../context/AuthContext";
import materi from "../../materi";
import { CiChat1, CiLogout } from "react-icons/ci";
import { MdOutlineHistory, MdOutlineQueryStats } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const toastOptions = {
  position: "top",
  variant: "subtle",
  duration: 3000,
  isClosable: true,
};

const ThumbsUpIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z"
    />
  </Icon>
);

const ThumbsDownIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.78 8.33,20.89C8.33,21.3 8.5,21.68 8.77,21.95L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z"
    />
  </Icon>
);

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

const RegenerateSidebarContent = ({
  session,
  onSessionUpdate,
  type,
  setType,
  difficulty,
  setDifficulty,
  language,
  setLanguage,
  total,
  setTotal,
  pages,
  setPages,
  onCollapse,
  sessionStats,
  isThesisMode,
  setIsThesisMode,
}) => {
  const selectedType = typeOptions.find((o) => o.value === type);
  const selectedDifficulty = difficultyOptions.find(
    (o) => o.value === difficulty,
  );
  const selectedLanguage = languageOptions.find((o) => o.value === language);
  const toast = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(session.title);
  useEffect(() => {
    setCurrentTitle(session.title);
  }, [session.title]);

  const handleTitleSave = async () => {
    const trimmedTitle = currentTitle.trim();
    setIsEditingTitle(false);
    if (trimmedTitle === session.title || !trimmedTitle) {
      setCurrentTitle(session.title);
      return;
    }
    try {
      await api.put(`/sessions/${session.id}/title`, { title: trimmedTitle });
      onSessionUpdate({ ...session, title: trimmedTitle });
      toast({
        ...toastOptions,
        title: "Judul berhasil diperbarui",
        status: "success",
      });
    } catch (error) {
      toast({
        ...toastOptions,
        title: "Gagal memperbarui judul",
        description: error.message,
        status: "error",
      });
    }
  };
  const formatPercent = (val) => {
    if (val === null || val === undefined) return "N/A";
    const num = parseFloat(val);
    if (isNaN(num)) return "N/A";
    const finalValue = num > 1 ? num : num * 100;
    return `${Math.min(finalValue, 100).toFixed(2)}%`;
  };

  const formatDuration = (val) => {
    if (val === null || val === undefined) return "N/A";
    const num = parseFloat(val);
    return !isNaN(num) ? `${num.toFixed(2)}s` : "N/A";
  };

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
          />
        )}
      </Flex>
      <Box p={3} bg="gray.100" borderRadius="md" fontSize="sm">
        <VStack align="stretch" spacing={3}>
          {isEditingTitle ? (
            <HStack>
              <Input
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                size="sm"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
              />
              <IconButton
                icon={<CheckIcon />}
                onClick={handleTitleSave}
                aria-label="Simpan Judul"
                size="sm"
              />
            </HStack>
          ) : (
            <Flex justify="space-between" align="center">
              <Text noOfLines={1} title={session.title}>
                <strong>Judul:</strong> {session.title}
              </Text>
              <IconButton
                icon={<EditIcon />}
                onClick={() => setIsEditingTitle(true)}
                aria-label="Ubah Judul"
                size="xs"
                variant="ghost"
              />
            </Flex>
          )}
          <Flex justify="space-between">
            <Text fontWeight="bold">File:</Text>
            <Link
              color="teal.600"
              href={`${materi}/${session.filename}`}
              isExternal
              title={session.filename}
              maxW="200px"
              noOfLines={1}
            >
              {session.filename}
            </Link>
          </Flex>
          <Divider />
          <VStack align="stretch" spacing={1}>
            <Heading size="xs" color="gray.600">
              Metrik Kinerja Model
            </Heading>
            <Flex justify="space-between" ml={2}>
              <Text>Model:</Text>
              <Text maxW="180px" noOfLines={1} title={session.model}>
                {session.model}
              </Text>
            </Flex>
            <Flex justify="space-between" ml={2}>
              <Text>Jumlah Total Soal:</Text>
              <Text>{sessionStats.totalQuestions}</Text>
            </Flex>
          </VStack>
          <VStack align="stretch" spacing={1}>
            <Heading size="xs" color="gray.600">
              Distribusi Tipe Soal
            </Heading>
            {typeOptions
              .filter((opt) => opt.value !== "all")
              .map((opt) => (
                <Flex justify="space-between" ml={2} key={opt.value}>
                  <Text>- {opt.label}:</Text>
                  <Text>
                    {sessionStats.questionTypeDistribution[opt.value] || 0}
                  </Text>
                </Flex>
              ))}
          </VStack>
          <VStack align="stretch" spacing={1}>
            <Heading size="xs" color="gray.600">
              Kinerja Kepercayaan (Confidence)
            </Heading>
            <Flex justify="space-between" ml={2}>
              <Text>- Tertinggi:</Text>
              <Text>{formatPercent(sessionStats.confidenceStats.max)}</Text>
            </Flex>
            <Flex justify="space-between" ml={2}>
              <Text>- Terendah:</Text>
              <Text>{formatPercent(sessionStats.confidenceStats.min)}</Text>
            </Flex>
            <Flex justify="space-between" ml={2}>
              <Text>- Rata-rata:</Text>
              <Text>{formatPercent(sessionStats.confidenceStats.avg)}</Text>
            </Flex>
          </VStack>
          <VStack align="stretch" spacing={1}>
            <Heading size="xs" color="gray.600">
              Kinerja Efisiensi Generasi
            </Heading>
            <Flex justify="space-between" ml={2}>
              <Text>- Tercepat:</Text>
              <Text>
                {formatDuration(sessionStats.efficiencyStats.fastest)}
              </Text>
            </Flex>
            <Flex justify="space-between" ml={2}>
              <Text>- Terlama:</Text>
              <Text>
                {formatDuration(sessionStats.efficiencyStats.slowest)}
              </Text>
            </Flex>
            <Flex justify="space-between" ml={2}>
              <Text>- Rata-rata:</Text>
              <Text>{formatDuration(sessionStats.efficiencyStats.avg)}</Text>
            </Flex>
          </VStack>
        </VStack>
      </Box>
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
            {typeOptions
              .filter((opt) => opt.value !== "all")
              .map((item, i) => (
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
            htmlFor="thesis-mode-session"
            mb="0"
            fontSize="sm"
            fontWeight="bold"
            color="purple.700"
          >
            Mode Tesis
          </FormLabel>
          <FormHelperText fontSize="xs" mt={0} color="purple.600">
            Campuran (40:30:30)
          </FormHelperText>
        </Box>
        <Switch
          id="thesis-mode-session"
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
    </VStack>
  );
};

function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout, updateUserCount } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const endOfQuestionsRef = useRef(null);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newType, setNewType] = useState("multiple-choice");
  const [newDifficulty, setNewDifficulty] = useState("mots");
  const [newLanguage, setNewLanguage] = useState("Indonesia");
  const [newTotal, setNewTotal] = useState(10);
  const [newKeywords, setNewKeywords] = useState("");
  const [generationError, setGenerationError] = useState(null);
  const [newPages, setNewPages] = useState("");
  const [isThesisMode, setIsThesisMode] = useState(false);

  const allQuestions = useMemo(
    () =>
      logs.flatMap((log) =>
        log.questions.map((q) => ({ ...q, ai_duration: log.duration })),
      ),
    [logs],
  );

  const detailedSessionStats = useMemo(() => {
    const defaultStats = {
      confidenceStats: { max: null, min: null, avg: null },
      efficiencyStats: { fastest: null, slowest: null, avg: null },
      questionTypeDistribution: {},
      totalQuestions: 0,
    };
    if (!allQuestions || allQuestions.length === 0) return defaultStats;

    const confidenceValues = allQuestions
      .map((q) => parseFloat(q.confidence))
      .filter((c) => !isNaN(c));
    const confidenceStats =
      confidenceValues.length > 0
        ? {
            max: Math.max(...confidenceValues),
            min: Math.min(...confidenceValues),
            avg:
              confidenceValues.reduce((a, b) => a + b, 0) /
              confidenceValues.length,
          }
        : defaultStats.confidenceStats;

    const questionTypeDistribution = allQuestions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {});

    const aiDurations = allQuestions
      .map((q) => parseFloat(q.ai_duration))
      .filter((d) => !isNaN(d));

    const efficiencyStats =
      aiDurations.length > 0
        ? {
            fastest: Math.min(...aiDurations),
            slowest: Math.max(...aiDurations),
            avg: aiDurations.reduce((a, b) => a + b, 0) / aiDurations.length,
          }
        : defaultStats.efficiencyStats;

    return {
      confidenceStats,
      questionTypeDistribution,
      efficiencyStats,
      totalQuestions: allQuestions.length,
    };
  }, [allQuestions]);

  const fetchSessionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/sessions/${id}`);
      const data = response.data;
      setSession(data.session);

      const logsWithDefaults = data.logs.map((log) => ({
        ...log,
        questions: log.questions.map((q) => {
          let parsedKeywords = q.keywords;
          if (typeof parsedKeywords === "string") {
            try {
              parsedKeywords = JSON.parse(parsedKeywords);
            } catch (e) {
              parsedKeywords = [];
            }
          }
          let parsedOptions = q.options;
          if (typeof parsedOptions === "string") {
            try {
              parsedOptions = JSON.parse(parsedOptions);
            } catch (e) {
              parsedOptions = [];
            }
          }
          return {
            ...q,
            id: q.id,
            isIncludedInExport: true,
            feedback: "none",
            keywords: Array.isArray(parsedKeywords) ? parsedKeywords : [],
            options: Array.isArray(parsedOptions) ? parsedOptions : [],
          };
        }),
      }));
      setLogs(logsWithDefaults);

      const lastLog =
        logsWithDefaults.length > 0
          ? logsWithDefaults[logsWithDefaults.length - 1]
          : null;
      if (lastLog && lastLog.questions.length > 0) {
        const lastQuestion = lastLog.questions[lastLog.questions.length - 1];
        setNewType(lastQuestion.type || "multiple-choice");
        setNewDifficulty(lastQuestion.difficulty || "mots");
        setNewLanguage(lastQuestion.language || "Indonesia");
        setNewPages(lastLog.pages || "");
      } else {
        setNewType("multiple-choice");
        setNewDifficulty("mots");
        setNewLanguage("Indonesia");
        setNewPages("");
      }
    } catch (err) {
      setError("Sesi tidak ditemukan atau Anda tidak memiliki akses.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  useEffect(() => {
    if (endOfQuestionsRef.current)
      endOfQuestionsRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      toast({ ...toastOptions, title: "Logout berhasil", status: "success" });
      navigate("/login");
      setIsLoggingOut(false);
    }, 700);
  };

  const handleRegenerate = async () => {
    if (!user) {
      toast({
        ...toastOptions,
        title: "Harap login terlebih dahulu",
        status: "warning",
      });
      return navigate("/login");
    }
    setGenerationError(null);
    setIsRegenerating(true);

    const finalDifficulty = isThesisMode ? "mixed" : newDifficulty;

    try {
      const response = await api.post(`/upload/add-to-session/${id}`, {
        type: newType,
        difficulty: finalDifficulty,
        language: newLanguage,
        total: newTotal,
        keywords: newKeywords,
        pages: newPages,
      });

      await fetchSessionData();

      updateUserCount(response.data.generation_count);
      toast({
        ...toastOptions,
        title: `${response.data.newQuestions.length} soal baru ditambahkan!`,
        status: "success",
      });
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error?.message || "Terjadi kesalahan";
      setGenerationError(errorMessage);
      toast({
        ...toastOptions,
        title: "Gagal menambah soal",
        description: errorMessage,
        status: "error",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        if (session && !isRegenerating && !loading) {
          event.preventDefault();
          handleRegenerate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session, isRegenerating, loading, handleRegenerate]);

  const handleToggleExport = (logIndex, questionIndex) => {
    const newLogs = JSON.parse(JSON.stringify(logs));
    const question = newLogs[logIndex].questions[questionIndex];
    question.isIncludedInExport = !question.isIncludedInExport;
    setLogs(newLogs);
  };

  const handleFeedback = (logIndex, questionIndex, feedbackType) => {
    const newLogs = JSON.parse(JSON.stringify(logs));
    const question = newLogs[logIndex].questions[questionIndex];
    question.feedback =
      question.feedback === feedbackType ? "none" : feedbackType;
    setLogs(newLogs);
    toast({
      title: "Terima kasih atas feedback Anda!",
      status: "success",
      duration: 1500,
      ...toastOptions,
    });
  };

  const getOptionLabel = (options, answer) => {
    if (!options || !Array.isArray(options)) return answer;
    const index = options.indexOf(answer);
    return index !== -1
      ? `${String.fromCharCode(65 + index)}. ${answer}`
      : answer;
  };

  const questionsToExport = allQuestions.filter((q) => q.isIncludedInExport);
  const totalSelectedForExport = questionsToExport.length;

  const handleExport = (exportFn) => {
    if (totalSelectedForExport === 0) {
      toast({
        title: "Tidak ada soal yang dipilih",
        status: "warning",
        ...toastOptions,
      });
      return;
    }

    const sessionDetailsForExport = {
      ...session,
      ...detailedSessionStats,
      total_questions: allQuestions.length,
    };

    const logsForExport = logs
      .map((log) => ({
        ...log,
        questions: log.questions.filter((q) => q.isIncludedInExport),
      }))
      .filter((log) => log.questions.length > 0);

    exportFn(logsForExport, sessionDetailsForExport);
  };

  const gridTemplateColumns = {
    base: "1fr",
    lg: `${isLeftSidebarCollapsed ? "0px" : "220px"} 1fr ${
      isRightSidebarCollapsed ? "0px" : "320px"
    }`,
  };
  const rightSidebarProps = {
    session,
    onSessionUpdate: setSession,
    type: newType,
    setType: setNewType,
    difficulty: newDifficulty,
    setDifficulty: setNewDifficulty,
    language: newLanguage,
    setLanguage: setNewLanguage,
    total: newTotal,
    setTotal: setNewTotal,
    pages: newPages,
    setPages: setNewPages,
    sessionStats: detailedSessionStats,
    isThesisMode,
    setIsThesisMode,
  };

  const difficultyColorScheme = {
    lots: "blue",
    mots: "orange",
    hots: "red",
  };

  const renderContent = () => {
    if (loading)
      return (
        <Flex h="100%" align="center" justify="center">
          <Spinner size="xl" />
        </Flex>
      );
    if (error)
      return (
        <Flex h="100%" align="center" justify="center" direction="column">
          <Heading color="red.500">Error</Heading>
          <Text mt={2}>{error}</Text>
          <Button mt={4} onClick={() => navigate("/")}>
            Kembali ke Halaman Utama
          </Button>
        </Flex>
      );
    let overallIndex = 0;
    return (
      <Box h="100%" w="100%" overflowY="auto">
        <VStack spacing={8} align="stretch">
          {logs.map((log, logIndex) => (
            <Box
              key={log.id}
              p={5}
              borderWidth={1}
              borderRadius="xl"
              bg="gray.50"
              shadow="sm"
            >
              <Flex
                justify="space-between"
                align="center"
                mb={4}
                pb={3}
                borderBottomWidth={1}
                borderColor="gray.200"
              >
                <Heading size="sm" color="gray.700">
                  Batch #{logIndex + 1}
                </Heading>
                <HStack color="gray.600" fontSize="sm">
                  <Text>
                    <strong>Halaman:</strong> {log.pages}
                  </Text>
                  <Divider orientation="vertical" h="1.2em" />
                  <Text>
                    <strong>Durasi AI:</strong> {log.duration}s
                  </Text>
                </HStack>
              </Flex>
              <VStack spacing={5} align="stretch">
                {log.questions.map((q, questionIndex) => {
                  const currentIndex = overallIndex++;
                  const handleCopy = () => {
                    const textToCopy = formatQuestion(q, currentIndex);
                    navigator.clipboard.writeText(textToCopy).then(() => {
                      toast({
                        title: "Soal disalin!",
                        status: "success",
                        duration: 1500,
                        ...toastOptions,
                      });
                    });
                  };
                  return (
                    <Flex key={`${q.id}-${currentIndex}`} align="start">
                      <Box
                        p={5}
                        borderWidth={1}
                        borderRadius="2xl"
                        shadow="xs"
                        w="full"
                        bg="white"
                        flex="1"
                        opacity={q.isIncludedInExport ? 1 : 0.5}
                        transition="opacity 0.2s ease-in-out"
                      >
                        <HStack
                          justify="space-between"
                          mb={2}
                          spacing="4"
                          align="start"
                        >
                          <Text fontWeight="bold" color="teal.700">
                            {currentIndex + 1}. {q.question}
                          </Text>
                          <VStack align="end" spacing={1}>
                            {q.type && (
                              <Badge colorScheme="purple" whiteSpace="nowrap">
                                {typeOptions.find((o) => o.value === q.type)
                                  ?.label || q.type}
                              </Badge>
                            )}
                            {q.difficulty && (
                              <Badge
                                colorScheme={
                                  difficultyColorScheme[q.difficulty] || "gray"
                                }
                                whiteSpace="nowrap"
                              >
                                {difficultyOptions.find(
                                  (o) => o.value === q.difficulty,
                                )?.label || q.difficulty}
                              </Badge>
                            )}
                          </VStack>
                        </HStack>
                        {q.options && Array.isArray(q.options) && (
                          <VStack spacing={1} mt={2} ml={2} align="start">
                            {q.options.map((option, i) => (
                              <Text key={i}>
                                {String.fromCharCode(65 + i)}. {option}
                              </Text>
                            ))}
                          </VStack>
                        )}
                        <Divider my={3} />
                        <VStack align="start" color="gray.600" spacing={1}>
                          <Text>
                            <strong>Jawaban:</strong>{" "}
                            {getOptionLabel(q.options, q.answer)}
                          </Text>
                          {q.explanation && (
                            <Text>
                              <strong>Penjelasan:</strong> {q.explanation}
                            </Text>
                          )}
                          {q.source_text && (
                            <Text>
                              <strong>Sumber Kalimat:</strong> "
                              <Link
                                isExternal
                                color="teal.600"
                                href={`${materi}/${
                                  q.source
                                }#:~:text=${encodeURIComponent(
                                  q.source_text
                                    .split(" ")
                                    .slice(0, 5)
                                    .join(" "),
                                )}`}
                              >
                                {q.source_text}
                              </Link>
                              "
                            </Text>
                          )}
                          {q.duration && (
                            <Text>
                              <strong>Estimasi Pengerjaan:</strong> {q.duration}
                            </Text>
                          )}
                          {q.confidence && (
                            <Text>
                              <strong>Tingkat Kepercayaan:</strong>{" "}
                              {q.confidence}
                            </Text>
                          )}
                        </VStack>

                        {q.keywords &&
                          Array.isArray(q.keywords) &&
                          q.keywords.length > 0 && (
                            <HStack mt={3} wrap="wrap">
                              {q.keywords.map((kw, i) => (
                                <Badge
                                  key={i}
                                  variant="subtle"
                                  colorScheme="green"
                                >
                                  #{kw}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                        <Flex
                          justify="flex-end"
                          mt={4}
                          display={{ base: "flex", lg: "none" }}
                          gap={2}
                          wrap="wrap"
                        >
                          <Button
                            size="sm"
                            variant={
                              q.feedback === "liked" ? "solid" : "outline"
                            }
                            colorScheme={
                              q.feedback === "liked" ? "green" : "gray"
                            }
                            leftIcon={<ThumbsUpIcon />}
                            onClick={() =>
                              handleFeedback(logIndex, questionIndex, "liked")
                            }
                          >
                            Suka
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              q.feedback === "disliked" ? "solid" : "outline"
                            }
                            colorScheme={
                              q.feedback === "disliked" ? "red" : "gray"
                            }
                            leftIcon={<ThumbsDownIcon />}
                            onClick={() =>
                              handleFeedback(
                                logIndex,
                                questionIndex,
                                "disliked",
                              )
                            }
                          >
                            Tidak Suka
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<CopyIcon />}
                            onClick={handleCopy}
                          >
                            Copy Soal
                          </Button>
                          <Button
                            size="sm"
                            variant={q.isIncludedInExport ? "solid" : "outline"}
                            colorScheme={
                              q.isIncludedInExport ? "green" : "gray"
                            }
                            leftIcon={
                              q.isIncludedInExport ? (
                                <CheckCircleIcon />
                              ) : (
                                <NotAllowedIcon />
                              )
                            }
                            onClick={() =>
                              handleToggleExport(logIndex, questionIndex)
                            }
                          >
                            {q.isIncludedInExport
                              ? "Ikut Ekspor"
                              : "Jangan Ekspor"}
                          </Button>
                        </Flex>
                      </Box>
                      <Box
                        position="sticky"
                        top="20px"
                        pl={4}
                        display={{ base: "none", lg: "block" }}
                      >
                        <VStack spacing={2}>
                          <Tooltip label="Suka" placement="left">
                            <IconButton
                              size="sm"
                              variant={
                                q.feedback === "liked" ? "solid" : "outline"
                              }
                              colorScheme={
                                q.feedback === "liked" ? "green" : "gray"
                              }
                              aria-label="Suka"
                              icon={<ThumbsUpIcon />}
                              onClick={() =>
                                handleFeedback(logIndex, questionIndex, "liked")
                              }
                            />
                          </Tooltip>
                          <Tooltip label="Tidak Suka" placement="left">
                            <IconButton
                              size="sm"
                              variant={
                                q.feedback === "disliked" ? "solid" : "outline"
                              }
                              colorScheme={
                                q.feedback === "disliked" ? "red" : "gray"
                              }
                              aria-label="Tidak Suka"
                              icon={<ThumbsDownIcon />}
                              onClick={() =>
                                handleFeedback(
                                  logIndex,
                                  questionIndex,
                                  "disliked",
                                )
                              }
                            />
                          </Tooltip>
                          <Tooltip label="Salin soal" placement="left">
                            <IconButton
                              size="sm"
                              variant="outline"
                              aria-label="Salin soal"
                              icon={<CopyIcon />}
                              onClick={handleCopy}
                            />
                          </Tooltip>
                          <Tooltip
                            label={
                              q.isIncludedInExport
                                ? "Keluarkan dari ekspor"
                                : "Sertakan dalam ekspor"
                            }
                            placement="left"
                          >
                            <IconButton
                              size="sm"
                              variant="outline"
                              colorScheme={
                                q.isIncludedInExport ? "green" : "gray"
                              }
                              aria-label="Toggle ekspor soal"
                              icon={
                                q.isIncludedInExport ? (
                                  <CheckCircleIcon />
                                ) : (
                                  <NotAllowedIcon />
                                )
                              }
                              onClick={() =>
                                handleToggleExport(logIndex, questionIndex)
                              }
                            />
                          </Tooltip>
                        </VStack>
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
        <Box ref={endOfQuestionsRef} />
      </Box>
    );
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
              <Heading size="md" color="teal.700" noOfLines={1}>
                {session?.title || "Hasil Sesi"}
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
                  noOfLines={1}
                >
                  {session?.title || "Hasil Sesi"}
                </Text>
              </HStack>
              <HStack spacing={3}>
                {!loading && !error && (
                  <>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {totalSelectedForExport} / {allQuestions.length}
                    </Text>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<DownloadIcon />}
                        size="sm"
                        variant="ghost"
                        aria-label="Opsi Ekspor"
                        isDisabled={allQuestions.length === 0}
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleExport(exportToWord)}>
                          Word (.docx)
                        </MenuItem>
                        <MenuItem onClick={() => handleExport(exportToPDF)}>
                          PDF (.pdf)
                        </MenuItem>
                        <MenuItem onClick={() => handleExport(exportToTxt)}>
                          Teks (.txt)
                        </MenuItem>
                        <MenuItem onClick={() => handleExport(exportToCSV)}>
                          CSV (.csv)
                        </MenuItem>
                        <MenuItem onClick={() => handleExport(exportToXLSX)}>
                          Excel (.xlsx)
                        </MenuItem>
                        <MenuItem onClick={() => handleExport(exportToJSON)}>
                          JSON (.json)
                        </MenuItem>
                      </MenuList>
                    </Menu>
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
                  </>
                )}
              </HStack>
            </Flex>
            <Box flex="1" p={{ base: 4, md: 6 }} overflow="hidden">
              {renderContent()}
            </Box>
            {!loading && !error && (
              <Box
                p={{ base: 3, md: 4 }}
                borderTop="1px solid"
                borderColor="gray.200"
                bg="white"
                boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
              >
                <VStack spacing={3} align="stretch">
                  {generationError && (
                    <Alert status="error" borderRadius="md" variant="subtle">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Gagal Menambah Soal</AlertTitle>
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
                  <HStack w="full" spacing={3}>
                    <Input
                      size="sm"
                      borderRadius="md"
                      placeholder="Tambahkan keywords baru (opsional), pisahkan dengan koma"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      autoComplete="off"
                      isDisabled={isRegenerating}
                    />
                    <Button
                      colorScheme="teal"
                      onClick={handleRegenerate}
                      isDisabled={isRegenerating}
                      size="sm"
                      w="180px"
                      flexShrink={0}
                    >
                      {isRegenerating ? (
                        <Spinner size="sm" />
                      ) : (
                        <HStack spacing={2}>
                          <Text>Generate Lagi</Text>
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
            )}
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
            {session && (
              <RegenerateSidebarContent
                {...rightSidebarProps}
                onCollapse={() => setIsRightSidebarCollapsed(true)}
              />
            )}
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
              {session && <RegenerateSidebarContent {...rightSidebarProps} />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Grid>
    </>
  );
}

export default SessionPage;
