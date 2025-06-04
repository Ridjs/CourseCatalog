import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { HeroUIProvider } from "@heroui/react";
import { Spinner, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Input, Link, Button, Card, CardFooter, Image, CardHeader, Switch, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ModelViewer } from './ModelViewer';

/*Code Example for HeroUI; just two svgs for switch*/
export const MoonIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SunIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
};
/*Ends here */

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [department, setDepartment] = useState("");
  const [searchWords, setSearchWords] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSpecial, setSelectedSpecial] = useState([]);
  const [selectedWeighting, setSelectedWeighting] = useState([]);
  const footer = useRef();
  const searchBar = useRef();

  useEffect(() => {
    setIsLoading(true);
    const filtered = courses.filter((course) => {
      const filterDepartment = (value) => selectedDepartments.length === 0 || selectedDepartments.includes(value["Department Name"]);
      const filterGrades = (value) => selectedGrades.length === 0 || selectedGrades.some(grade => value["Credits and Level"].includes(grade));
      const filterCredits = (value) => selectedCredits.length === 0 || selectedCredits.some(credits => value["Credits and Level"].includes(credits));
      const filterWeighting = (value) => selectedWeighting.length === 0 || selectedWeighting.some(weighting => value["Credits and Level"].includes(weighting));
      const filterSpecial = (value) => selectedSpecial.length === 0 || selectedSpecial.some(special => value["Course Catalog Description"].includes(special));
      const filterSearch = (value) => searchWords.trim() === "" || value["Course Code"].toLowerCase().includes(searchWords.toLowerCase()) || value["Course Catalog Description"].toLowerCase().includes(searchWords.toLowerCase()) || value["Course Description"].toLowerCase().includes(searchWords.toLowerCase()) || value["Special Program Description"].includes(searchWords.toLowerCase()) || value["Department Name"].toLowerCase().includes(searchWords.toLowerCase()) || value["Credits and Level"].toLowerCase().includes(searchWords.toLowerCase());
      return (filterDepartment(course) && filterGrades(course) && filterCredits(course) && filterWeighting(course) && filterSpecial(course) && filterSearch(course));
    });
    setFilteredCourses(filtered);
    setIsLoading(false);
  }, [selectedGrades,selectedCredits,selectedWeighting,selectedDepartments,selectedSpecial, searchWords, courses]);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:8080/courses')
      .then(response => {
        setPosts(response.data);
        setDepartments(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (department && searchBar.current) {
      requestAnimationFrame(() => {
        searchBar.current.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [department]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => { 
    setIsLoading(true);
    axios.get('http://localhost:8080/all')
      .then(response => { setCourses(response.data); setFilteredCourses(response.data); setIsLoading(false)})
      .catch(error => { console.error(error); });
  },[]);

  return (
    <HeroUIProvider>
      <div className="text-center">
        <header className="fixed w-full top-0 left-0 z-50 bg-white dark:bg-black min-h-[16vh] flex flex-col md:flex-row items-center justify-center text-[calc(10px+2vmin)]">
          <div className="w-full md:w-[20%] flex justify-center items-center">
            <img src="/sbhs_logo.png" className="h-[14vmin] pointer-events-none" alt="logo" />
          </div>
          <div className='w-full md:w-[60%] text-center font-bold'>
            <p>SOUTH BRUNSWICK HIGH SCHOOL <br /> COURSE CATALOG 2025-26</p>
          </div>
          <div className="w-full md:w-[20%] flex flex-row gap-4 justify-center items-center">
            {/*HeroUI Component Code*/}
            <Switch defaultSelected color="secondary" size="sm" selected={isDark} onChange={() => setIsDark(!isDark)}
              thumbIcon={({ isSelected, className }) =>
                isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
            }>
            </Switch>
            {/*Ends here*/}
            <div className="relative w-6 md:w-[10%] cursor-pointer" onClick={onOpen}>
              <img
                src="/red-heart-icon.png"
                alt="Wishlist"
                className="w-full"
              />
              {favoriteCourses.length > 0 && (
                <span className="absolute -top-2 -right-1.5 bg-yellow-500 text-white dark:text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {favoriteCourses.length}
                </span>
              )}
            </div>
            <img onClick={()=>footer.current?.scrollIntoView({behavior:'smooth'})}
              className="w-6 md:w-[10%] cursor-pointer"
              src="/info-icon.png"
              alt="More info icon">
            </img>
            {/*HeroUI Component Code for Animation*/}
            <Drawer
              isOpen={isOpen}
              backdrop="blur"
              motionProps={{
                variants: {
                  enter: {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                  },
                  exit: {
                    x: 100,
                    opacity: 0,
                    duration: 0.3,
                  },
                },
              }}
              onOpenChange={onOpenChange}
            >{/*Ends here*/}
              <DrawerContent>
                {(onClose) => (
                  <>
                  <DrawerHeader className="flex flex-col gap-1">Favorite Courses</DrawerHeader>
                    <DrawerBody>
                      {favoriteCourses.length !== 0 ? favoriteCourses.map((course, index) => (
                        <div className="flex flex-col w-[100%]">
                          <div className="flex flex-row">
                            <p key={index} className="whitespace-pre-line w-[80%]">{`${course["Course Description"]}\n${course["Credits and Level"]}`}</p>
                            <div className="w-[20%] flex justify-center items-center">
                              <img onClick={() => { !favoriteCourses.includes(course) ? setFavoriteCourses([...favoriteCourses, course]) : setFavoriteCourses(favoriteCourses.filter(favCourse => favCourse !== course)) }} src="red-heart-icon.png" className="w-[25%] cursor-pointer" alt="Wishlist icon"></img>
                            </div>
                          </div>
                          <hr className="mt-2 border-2"/>
                        </div>
                      )):<p className="flex w-full h-full justify-center items-center">No favorites.</p>}
                    </DrawerBody>
                    <DrawerFooter>
                      <Button color="primary" onPress={onClose}>
                        Close
                      </Button>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </header>
      </div>
      {department==="" ? 
        <div className="mt-[18vh] md:mt-[16vh] flex flex-row flex-wrap justify-center gap-2">
          {posts.map((post, index) => (
            <Card isFooterBlurred className="w-full sm:w-[48%] md:w-[23%] h-[300px] flex flex-col m-2 hover:scale-105 border-2 border-black dark:border-white">
              <CardHeader className="z-10 flex-col items-center h-[50px] text-center">
                <h4 className="text-black/90 dark:text-white/90 font-medium text-xl">{post["Department Name"].toUpperCase()}</h4>
              </CardHeader>
              <div className="flex-grow flex items-center justify-center overflow-hidden">
                {post["Department Name"] === "English / Language Arts" ?
                  (<ModelViewer modelPath="/models/English.glb" />)
                  : post["Department Name"] === "Physical Education / Health" ?
                    (<ModelViewer modelPath="/models/Physical Education.glb" />)
                    : (<ModelViewer modelPath={`/models/${post["Department Name"]}.glb`} />)
                }
              </div>
              <CardFooter className="bg-black/40 dark:bg-white/40 z-10 border-t-1.5 border-default-600 dark:border-white h-[20%]">
                <div className="flex flex-row items-center w-full">
                  <p className="text-small text-white dark:text-black w-[70%] flex-none">Go to courses.</p>
                  <Image onClick={() => {
                    setDepartment(post["Department Name"]); setSelectedDepartments([post["Department Name"]]);
                  }} src="/right-arrow.png" className="w-[30%] flex-none ml-auto cursor-pointer"></Image>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div> :
        <div className="mt-[18vh] md:mt-[16vh] w-full flex flex-wrap gap-4">
          <div className="w-full mt-1">
            <div key="search" className="flex w-full flex-wrap md:flex-nowrap mb-3 gap-4">
              <div className="flex flex-row w-[100%] gap-2">
                <Input ref={searchBar} startContent={<img src={isDark ? "/search-icon-white.png" : "/search-icon.png"} className="w-[7%] md:w-[01.5%]" alt="search-icon" />} className="ml-2 w-[90%]" isClearable type="search" onValueChange={(val) => setSearchWords(val.trim())} onClear={() => setSearchWords("")} label="Search" placeholder="Words (ex: 21st Century, books)" variant="bordered" />
                <Button onPress={()=>{setSelectedCredits([]); setFilteredCourses([]); setSelectedDepartments([]); setSelectedGrades([]); setSelectedSpecial([]); setSelectedWeighting([])}}
                  className="w-[10%] mr-2 h-full font-bold whitespace-normal sm:whitespace-normal text-xs sm:text-base" variant="bordered" color="danger">Clear All Filters</Button>
              </div>
            </div>
          <div className="ml-2 flex flex-wrap md:flex-nowrap w-[98.5%] flex-row gap-2">
            <Dropdown backdrop='blur'>
              <DropdownTrigger>
                <Button className="capitalize w-[48%] md:w-1/5 border-2 border-black dark:border-white" variant="flat">
                  Grade Level
                  <img
                    className="w-[10%] ml-auto"
                    src={isDark ? "/down-arrow-white.png": "/down-arrow.png"}
                    alt="Dropdown arrow">
                  </img>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Select Grade Level"
                closeOnSelect={false}
                selectedKeys={new Set(selectedGrades)}
                selectionMode="multiple"
                variant="shadow"
                onSelectionChange={(keys) => setSelectedGrades(Array.from(keys))}
              >
                <DropdownItem key="09">9th</DropdownItem>
                <DropdownItem key="10">10th</DropdownItem>
                <DropdownItem key="11">11th</DropdownItem>
                <DropdownItem key="12">12th</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown backdrop='blur'>
              <DropdownTrigger>
                <Button className="capitalize w-[48%] md:w-1/5 border-2 border-black dark:border-white" variant="flat">
                  Department Name
                  <img
                    className="w-[10%] ml-auto"
                    src={isDark ? "/down-arrow-white.png": "/down-arrow.png"}
                    alt="Dropdown arrow">
                  </img>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Select Departments"
                closeOnSelect={false}
                selectedKeys={new Set(selectedDepartments)}
                selectionMode="multiple"
                variant="shadow"
                onSelectionChange={(keys) => setSelectedDepartments(Array.from(keys))}
              >
                {departments.map((post, index) => (
                  <DropdownItem key={post["Department Name"]}>{post["Department Name"]}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown backdrop='blur'>
              <DropdownTrigger>
                <Button className="capitalize w-[48%] md:w-1/5 border-2 border-black dark:border-white" variant="flat">
                  Weighting
                  <img
                    className="w-[10%] ml-auto"
                    src={isDark ? "/down-arrow-white.png": "/down-arrow.png"}
                    alt="Dropdown arrow">
                  </img>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Select Weighting"
                closeOnSelect={false}
                selectedKeys={new Set(selectedWeighting)}
                selectionMode="multiple"
                variant="shadow"
                onSelectionChange={(keys)=>setSelectedWeighting(Array.from(keys))}
              >
                <DropdownItem key="AP/College">AP/COLLEGE</DropdownItem>
                <DropdownItem key="Honors">HONORS</DropdownItem>
                <DropdownItem key="Dual Credit">DUAL CREDIT</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown backdrop='blur'>
              <DropdownTrigger>
                <Button className="capitalize w-[48%] md:w-1/5 border-2 border-black dark:border-white" variant="flat">
                  Credits
                  <img
                    className="w-[10%] ml-auto"
                    src={isDark ? "/down-arrow-white.png": "/down-arrow.png"}
                    alt="Dropdown arrow">
                  </img>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Select Course Credits"
                closeOnSelect={false}
                selectedKeys={new Set(selectedCredits)}
                selectionMode="multiple"
                variant="shadow"
                onSelectionChange={(keys) => setSelectedCredits(Array.from(keys))}
              >
                <DropdownItem key="1.25">1.25</DropdownItem>
                <DropdownItem key="2.5">2.5</DropdownItem>
                <DropdownItem key="3.75">3.75</DropdownItem>
                <DropdownItem key="5.0">5.0</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown backdrop='blur'>
              <DropdownTrigger>
                <Button className="capitalize w-[48%] md:w-1/5 border-2 border-black dark:border-white" variant="flat">
                  Specialized Interest
                  <img
                    className="w-[10%] ml-auto"
                    src={isDark ? "/down-arrow-white.png": "/down-arrow.png"}
                    alt="Dropdown arrow">
                  </img>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Select Specialized Interests"
                closeOnSelect={false}
                selectedKeys={new Set(selectedSpecial)}
                selectionMode="multiple"
                variant="shadow"
                onSelectionChange={(keys) => setSelectedSpecial(Array.from(keys))}
                >
                <DropdownItem key="Computer Science Academy">Computer Science Academy</DropdownItem>
                <DropdownItem key="Viking Television Network">VTN</DropdownItem>
                <DropdownItem key="DECA">DECA</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="w-[98.5%]">
          <Table className="ml-2" radius="sm" isStriped aria-label="Table with courses">
            <TableHeader>
              <TableColumn className="text-center text-sm border-r border-r-black dark:border-r-white">Course Info</TableColumn>
              <TableColumn className="text-center text-sm border-r border-r-black dark:border-r-white">Course Name</TableColumn>
              <TableColumn className="text-center text-sm border-r border-r-black dark:border-r-white">Course Description</TableColumn>
              <TableColumn className="text-center text-sm border-r border-r-black dark:border-r-white">More Info</TableColumn>
              <TableColumn className="text-center text-sm border-l border-l-black dark:border-l-white">Wishlist</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading... "></Spinner>} radius="lg" emptyContent={"No courses to display."}>
              {filteredCourses.map((course, index)=>(
                <TableRow key={index}>
                  <TableCell className="w-[17.5%] md:w-[15%] border-r border-r-black dark:border-r-white text-center whitespace-pre-line">{`${course["Course Code"]}\n\n${course["Department Name"]}\n\n${course["Credits and Level"]}`}</TableCell>
                  <TableCell className="w-[15%] md:w-[19%] border-r border-r-black dark:border-r-white text-center whitespace-pre-line">{course["Course Description"]}</TableCell>
                  <TableCell className="w-[49%] md:w-[45%] border-r border-r-black dark:border-r-white whitespace-pre-line">{course["Course Catalog Description"]}</TableCell>
                  <TableCell className="w-[18%] md:w-[20%] border-r border-r-black dark:border-r-white whitespace-pre-line">{course["Special Program Description"]}</TableCell>
                  <TableCell className="w-[0.5%] md:w-[01%] border-l border-l-black dark:border-l-white">
                    <img onClick={() => {!favoriteCourses.includes(course)?setFavoriteCourses([...favoriteCourses, course]):setFavoriteCourses(favoriteCourses.filter(favCourse=>favCourse!==course))}} src={favoriteCourses.includes(course) ? "red-heart-icon.png" : isDark ? "heart-thin-icon-white.png" : "heart-thin-icon.png"} className="w-[50%] cursor-pointer m-auto" alt="Wishlist icon"></img>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <button
          onClick={() => { setDepartment(""); setSelectedCredits([]); setFilteredCourses([]); setSelectedDepartments([]); setSelectedGrades([]); setSelectedSpecial([]); setSelectedWeighting([])}}
          className="fixed bottom-6 right-6 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-xl text-white dark:text-black rounded-full shadow-lg flex items-center justify-center">
          ←
        </button>
      </div>  
      }
      <hr className='mt-2 ml-2 mr-2'></hr>
      <h3 className="ml-2">More Resources:</h3>
      <div className="flex flex-col gap-2 ml-2" ref={footer}>
        <Link className='w-fit' isExternal showAnchorIcon href="https://docs.google.com/document/d/1ZquU_-e5lhoQG4QaBFQSiol-PkL06RvlLdVC5VlmvQM/edit?tab=t.0">
          SPECIAL EDUCATION
        </Link>
        <Link className="w-fit" isExternal showAnchorIcon href="https://sbhs.sbschools.org/school_information/s_b_h_s/career_academies">
          COMPUTER SCIENCE ACADEMY
        </Link>
        <Link className="w-fit" isExternal showAnchorIcon href="https://www.deca.org/">
          DECA
        </Link>
        <Link className="w-fit" isExternal showAnchorIcon href="https://sites.google.com/sbschools.org/vtnannouncements/home">
          VTN (VIKING TELEVISION NETWORK)
        </Link>
        <Link className="w-fit" isExternal showAnchorIcon href="https://docs.google.com/document/d/1_v2Mmcg3wg_6mQKO6f5VpfiknErThEuPvOkJjvb2hFA/edit?tab=t.0">
          GUIDELINES FOR SCHEDULING
        </Link>
        <Link className="w-fit" isExternal showAnchorIcon href="https://sites.google.com/sbschools.org/sbhs-guidancesps/scheduling">
          OPTION II
        </Link>
        {department==="" ? (
          <details className="text-xs px-4 py-2 mt-4 mr-2 mb-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <summary className="cursor-pointer font-semibold text-black dark:text-white">3D Model Attributions <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer"><u className='text-blue-500'>(CC-BY 3.0)</u></a></summary>
            <div className="mt-2text-black dark:text-white/70">
              <p>• <strong>Computer</strong> by Poly by Google via Poly Pizza – <a href="https://poly.pizza/m/2EHvZLax4Y3" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Bank</strong> by Poly by Google via Poly Pizza – <a href="https://poly.pizza/m/f1GOJtZFtsR" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Books</strong> by Jie Gu via Poly Pizza – <a href="https://poly.pizza/m/cQ3DYD9qBVf" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>House</strong> by Peter Le Bek via Poly Pizza– <a href="https://poly.pizza/m/diphAid-jq6" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Easel</strong> by Poly by Google via Poly Pizza– <a href="https://poly.pizza/m/6UQpoYGTvkL" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Calculator</strong> by Poly by Google via Poly Pizza – <a href="https://poly.pizza/m/0yU6BDQRVYw" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Boombox</strong> by Poly by Google  via Poly Pizza– <a href="https://poly.pizza/m/56XYDxnVVM3" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Gym</strong> by Poly by Google via Poly Pizza – <a href="https://poly.pizza/m/b8qvlEWcPY6" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Chemistry</strong> by Workshop apelab Poly Pizza – <a href="https://poly.pizza/m/83OkFAim_yo" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Map</strong> by Poly by Google Poly Pizza – <a href="https://poly.pizza/m/bU3B6P0ngfi" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
              <p>• <strong>Robot</strong> by Poly by Google Poly Pizza – <a href="https://poly.pizza/m/9A6cuitiB_4" target="_blank" rel="noopener noreferrer"><u className="text-blue-500">Source</u></a></p>
            </div>
          </details>)
        : <div></div>}
      </div>
    </HeroUIProvider>
  );
}

export default App;