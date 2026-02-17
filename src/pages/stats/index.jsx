import { useDisclosure } from "@chakra-ui/react";
import {
  SearchIcon,
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { BsGrid3X3GapFill, BsTable } from "react-icons/bs";
import modelOptions from "@/modelOptions.json";
import AuthContext from "../../context/AuthContext";
import api from "../../api";
import { CiChat1, CiLogout } from "react-icons/ci";
import { MdOutlineHistory, MdOutlineQueryStats } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const ITEMS_PER_PAGE = 9;

const modelLabelMap = new Map(
  modelOptions.map((opt) => [opt.value, opt.label]),
);

const formatPercent = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  const finalValue = num > 1 ? num : num * 100;
  return `${Math.min(finalValue, 100).toFixed(2)}%`;
};

const formatDuration = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return `${num.toFixed(2)} d`;
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
              variant="solid"
              colorScheme="teal"
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

const StatCard = ({ stat, visibility }) => {
  const {
    modelValue,
    modelLabel,
    totalQuestions,
    multipleChoiceCount,
    essayCount,
    trueFalseCount,
    fillInTheBlankCount,
    maxConfidence,
    minConfidence,
    avgConfidence,
    minDuration,
    maxDuration,
    avgDuration,
  } = stat;

  const DetailSection = ({ title, data }) => (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
        {title}
      </Text>
      <VStack align="stretch" spacing={1} fontSize="sm">
        {data.map((item) => (
          <Flex key={item.label} justify="space-between">
            <Text color="gray.500">{item.label}</Text>
            <Text fontWeight="medium" color="gray.800">
              {item.value}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="xl"
      bg="white"
      shadow="xs"
      transition="all 0.2s"
      _hover={{ shadow: "md", transform: "translateY(-4px)" }}
    >
      <VStack align="stretch" spacing={4}>
        <Box minH="60px">
          <Heading size="sm" color="gray.800" noOfLines={2} title={modelLabel}>
            {modelLabel}
          </Heading>
          <Code fontSize="xs" colorScheme="gray" mt={1}>
            {modelValue}
          </Code>
        </Box>

        {visibility.includes("total") && (
          <>
            <Divider />
            <DetailSection
              title={`Total Soal: ${totalQuestions.toLocaleString()}`}
              data={[
                {
                  label: "Pilihan Ganda",
                  value: multipleChoiceCount.toLocaleString(),
                },
                { label: "Esai", value: essayCount.toLocaleString() },
                {
                  label: "Benar/Salah",
                  value: trueFalseCount.toLocaleString(),
                },
                { label: "Isian", value: fillInTheBlankCount.toLocaleString() },
              ]}
            />
          </>
        )}

        {visibility.includes("confidence") && (
          <>
            <Divider />
            <DetailSection
              title="Kinerja Kepercayaan"
              data={[
                { label: "Tertinggi", value: formatPercent(maxConfidence) },
                { label: "Terendah", value: formatPercent(minConfidence) },
                { label: "Rata-rata", value: formatPercent(avgConfidence) },
              ]}
            />
          </>
        )}

        {visibility.includes("efficiency") && (
          <>
            <Divider />
            <DetailSection
              title="Kinerja Efisiensi"
              data={[
                { label: "Tercepat", value: formatDuration(minDuration) },
                { label: "Terlama", value: formatDuration(maxDuration) },
                { label: "Rata-rata", value: formatDuration(avgDuration) },
              ]}
            />
          </>
        )}
      </VStack>
    </Box>
  );
};
const StatTable = ({ stats, visibility }) => {
  return (
    <TableContainer bg="white" borderRadius="lg" shadow="sm" borderWidth={1}>
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th
              rowSpan={2}
              verticalAlign="middle"
              position="sticky"
              left={0}
              bg="gray.50"
              zIndex={1}
              shadow="sm"
            >
              Model
            </Th>
            {visibility.includes("total") && (
              <Th colSpan={5} textAlign="center">
                Total Soal
              </Th>
            )}
            {visibility.includes("confidence") && (
              <Th colSpan={3} textAlign="center">
                Kinerja Kepercayaan
              </Th>
            )}
            {visibility.includes("efficiency") && (
              <Th colSpan={3} textAlign="center">
                Kinerja Efisiensi
              </Th>
            )}
          </Tr>
          <Tr>
            {visibility.includes("total") && (
              <>
                <Th isNumeric>Total</Th>
                <Th isNumeric>PG</Th>
                <Th isNumeric>Esai</Th>
                <Th isNumeric>B/S</Th>
                <Th isNumeric>Isian</Th>
              </>
            )}
            {visibility.includes("confidence") && (
              <>
                <Th isNumeric>Tertinggi</Th>
                <Th isNumeric>Terendah</Th>
                <Th isNumeric>Rata-rata</Th>
              </>
            )}
            {visibility.includes("efficiency") && (
              <>
                <Th isNumeric>Tercepat</Th>
                <Th isNumeric>Terlama</Th>
                <Th isNumeric>Rata-rata</Th>
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {stats.map((stat) => (
            <Tr key={stat.modelValue}>
              <Td position="sticky" left={0} bg="white" zIndex={1} shadow="sm">
                <Text fontWeight="bold" noOfLines={1} title={stat.modelLabel}>
                  {stat.modelLabel}
                </Text>
                <Code fontSize="2xs">{stat.modelValue}</Code>
              </Td>
              {visibility.includes("total") && (
                <>
                  <Td isNumeric fontWeight="bold">
                    {stat.totalQuestions.toLocaleString()}
                  </Td>
                  <Td isNumeric>{stat.multipleChoiceCount.toLocaleString()}</Td>
                  <Td isNumeric>{stat.essayCount.toLocaleString()}</Td>
                  <Td isNumeric>{stat.trueFalseCount.toLocaleString()}</Td>
                  <Td isNumeric>{stat.fillInTheBlankCount.toLocaleString()}</Td>
                </>
              )}
              {visibility.includes("confidence") && (
                <>
                  <Td isNumeric>{formatPercent(stat.maxConfidence)}</Td>
                  <Td isNumeric>{formatPercent(stat.minConfidence)}</Td>
                  <Td isNumeric fontWeight="bold">
                    {formatPercent(stat.avgConfidence)}
                  </Td>
                </>
              )}
              {visibility.includes("efficiency") && (
                <>
                  <Td isNumeric>{formatDuration(stat.minDuration)}</Td>
                  <Td isNumeric>{formatDuration(stat.maxDuration)}</Td>
                  <Td isNumeric fontWeight="bold">
                    {formatDuration(stat.avgDuration)}
                  </Td>
                </>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push("...");
      }
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return [...new Set(pageNumbers)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <HStack spacing={2} justify="center">
      <IconButton
        icon={<ChevronLeftIcon />}
        aria-label="Previous Page"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        variant="ghost"
      />
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <Text key={`ellipsis-${index}`} px={2} color="gray.500">
            ...
          </Text>
        ) : (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}
      <IconButton
        icon={<ChevronRightIcon />}
        aria-label="Next Page"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        variant="ghost"
      />
    </HStack>
  );
};

function StatsPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState({
    value: "totalQuestions",
    label: "Jumlah Soal",
    order: "desc",
  });
  const [visibility, setVisibility] = useState([
    "total",
    "confidence",
    "efficiency",
  ]);
  const [viewMode, setViewMode] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isOpen: isLeftDrawerOpen,
    onOpen: onLeftDrawerOpen,
    onClose: onLeftDrawerClose,
  } = useDisclosure();

  const sortOptions = [
    { value: "totalQuestions", label: "Jumlah Soal", order: "desc" },
    { value: "avgConfidence", label: "Kepercayaan", order: "desc" },
    { value: "modelLabel", label: "Nama Model", order: "asc" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/stats");
        const dbStats = response.data;

        const allModels = new Map();

        modelOptions.forEach((opt) => {
          allModels.set(opt.value, {
            modelValue: opt.value,
            modelLabel: opt.label,
            totalQuestions: 0,
            multipleChoiceCount: 0,
            essayCount: 0,
            trueFalseCount: 0,
            fillInTheBlankCount: 0,
            maxConfidence: null,
            minConfidence: null,
            avgConfidence: null,
            minDuration: null,
            maxDuration: null,
            avgDuration: null,
          });
        });

        dbStats.forEach((dbStat) => {
          const modelData = allModels.get(dbStat.model) || {};
          allModels.set(dbStat.model, {
            ...modelData,
            modelValue: dbStat.model,
            modelLabel: modelLabelMap.get(dbStat.model) || dbStat.model,
            totalQuestions: parseInt(dbStat.totalQuestions) || 0,
            multipleChoiceCount: parseInt(dbStat.multipleChoiceCount) || 0,
            essayCount: parseInt(dbStat.essayCount) || 0,
            trueFalseCount: parseInt(dbStat.trueFalseCount) || 0,
            fillInTheBlankCount: parseInt(dbStat.fillInTheBlankCount) || 0,
            maxConfidence: parseFloat(dbStat.maxConfidence) || null,
            minConfidence: parseFloat(dbStat.minConfidence) || null,
            avgConfidence: parseFloat(dbStat.avgConfidence) || null,
            minDuration: parseFloat(dbStat.minDuration) || null,
            maxDuration: parseFloat(dbStat.maxDuration) || null,
            avgDuration: parseFloat(dbStat.avgDuration) || null,
          });
        });

        setStats(Array.from(allModels.values()));
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const filteredAndSortedStats = useMemo(() => {
    return stats
      .filter(
        (stat) =>
          stat.modelLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stat.modelValue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const { value, order } = sortOption;
        const valA = a[value] === null ? -Infinity : a[value];
        const valB = b[value] === null ? -Infinity : b[value];

        if (order === "asc") {
          return valA > valB ? 1 : -1;
        }
        return valB > valA ? 1 : -1;
      });
  }, [stats, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedStats.length / ITEMS_PER_PAGE);

  const paginatedStats = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedStats.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [currentPage, filteredAndSortedStats]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 700);
  };

  const gridTemplateColumns = {
    base: "1fr",
    lg: `${isLeftSidebarCollapsed ? "0px" : "220px"} 1fr`,
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
          <Spinner size="xl" />
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
        >
          <Box
            visibility={isLeftSidebarCollapsed ? "hidden" : "visible"}
            opacity={isLeftSidebarCollapsed ? 0 : 1}
            transition="opacity 0.2s"
          >
            <LeftSidebarContent
              user={user}
              onLogoutClick={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </Box>
        </GridItem>
        <GridItem as="main" h="100vh" position="relative" overflowX="hidden">
          <Flex direction="column" h="100%" bg="gray.50">
            {}
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
                AIsoal Stats
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
                  Statistik ({filteredAndSortedStats.length})
                </Heading>
              </HStack>
            </Flex>
            <Box flex="1" p={{ base: 4, md: 6 }} overflowY="auto">
              <VStack spacing={6} align="stretch" mx="auto">
                <Box>
                  <Heading as="h1" size="lg" color="gray.800">
                    Statistik Model AI Global
                  </Heading>
                  <Text color="gray.600" mt={1}>
                    Performa gabungan dari semua model AI yang digunakan di
                    platform ini.
                  </Text>
                </Box>

                <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                  {}
                  <VStack align="stretch" spacing={4}>
                    <HStack spacing={4} wrap="wrap">
                      <InputGroup flex="1" minW={{ base: "100%", md: "250px" }}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Cari model..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Urutkan: {sortOption.label}
                        </MenuButton>
                        <MenuList>
                          {sortOptions.map((opt) => (
                            <MenuItem
                              key={opt.value}
                              onClick={() => setSortOption(opt)}
                            >
                              {opt.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                      <HStack>
                        <IconButton
                          icon={<Icon as={BsGrid3X3GapFill} />}
                          aria-label="Card View"
                          colorScheme={viewMode === "card" ? "teal" : "gray"}
                          onClick={() => setViewMode("card")}
                        />
                        <IconButton
                          icon={<Icon as={BsTable} />}
                          aria-label="Table View"
                          colorScheme={viewMode === "table" ? "teal" : "gray"}
                          onClick={() => setViewMode("table")}
                        />
                      </HStack>
                    </HStack>
                    <CheckboxGroup
                      colorScheme="teal"
                      value={visibility}
                      onChange={setVisibility}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.600"
                        mb={2}
                      >
                        Tampilkan Data:
                      </Text>
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        spacing={[2, 5]}
                      >
                        <Checkbox value="total">Total Soal</Checkbox>
                        <Checkbox value="confidence">
                          Kinerja Kepercayaan
                        </Checkbox>
                        <Checkbox value="efficiency">
                          Kinerja Efisiensi
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </VStack>
                </Box>

                {isLoading ? (
                  <Flex justify="center" align="center" h="40vh">
                    <Spinner size="xl" />
                  </Flex>
                ) : (
                  <>
                    {viewMode === "card" ? (
                      <SimpleGrid
                        columns={{ base: 1, md: 2, xl: 3 }}
                        spacing={6}
                      >
                        {paginatedStats.length > 0 ? (
                          paginatedStats.map((stat) => (
                            <StatCard
                              key={stat.modelValue}
                              stat={stat}
                              visibility={visibility}
                            />
                          ))
                        ) : (
                          <Text
                            gridColumn="1 / -1"
                            textAlign="center"
                            color="gray.500"
                            p={8}
                          >
                            Tidak ada model yang cocok dengan pencarian Anda.
                          </Text>
                        )}
                      </SimpleGrid>
                    ) : (
                      <StatTable
                        stats={paginatedStats}
                        visibility={visibility}
                      />
                    )}

                    {totalPages > 1 && (
                      <Flex justify="center" mt={6}>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </Flex>
                    )}
                  </>
                )}
              </VStack>
            </Box>
          </Flex>
        </GridItem>
        {}
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

export default StatsPage;
