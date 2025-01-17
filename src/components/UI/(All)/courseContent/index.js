'use client'
import * as React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, Grid, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const CourseContent = React.memo(({ courseId }) => {
  const [courseData, setCourseData] = React.useState([]);
  const [selectedContent, setSelectedContent] = React.useState(null);
  const [pagesData, setPagesData] = React.useState([]);
  const [selectedPageContent, setSelectedPageContent] = React.useState(null);
  const [selectedPageName, setSelectedPageName] = React.useState('');
  const [selectedContentName, setSelectedContentName] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState({});

  React.useEffect(() => {
    const fetchCourseContents = async () => {
      const token = '7c3afb790462432d924aef3f79a90b22';
      const wsFunction = 'core_course_get_contents';
      const moodleWsRestFormat = 'json';
      const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&courseid=${courseId}&moodlewsrestformat=${moodleWsRestFormat}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setCourseData(data);
          localStorage.setItem('courseData', JSON.stringify(data));  //Tối ưu google cache
        } else {
          console.error('Fetched course data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching course contents:', error);
      }
    };

    const fetchPagesByCourses = async () => {
      const token = '7c3afb790462432d924aef3f79a90b22';
      const wsFunction = 'mod_page_get_pages_by_courses';
      const moodleWsRestFormat = 'json';
      const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&courseids[0]=${courseId}&moodlewsrestformat=${moodleWsRestFormat}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setPagesData(data.pages);
        localStorage.setItem('pagesData', JSON.stringify(data.pages)); //Tối ưu google cache

        if (data.pages && data.pages.length > 0) {
          setSelectedPageContent(data.pages[0].content);
          setSelectedPageName(data.pages[0].name);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchCourseContents();
    fetchPagesByCourses();
  }, [courseId]);

  const handleModuleClick = async (module) => {
    const pageId = module.instance;
    const page = pagesData.find(p => p.id === pageId);

    if (page) {
      setSelectedPageContent(page.content);
      setSelectedPageName(page.name);
      localStorage.setItem('selectedPageContent', page.content);//Tối ưu google cache
      localStorage.setItem('selectedPageName', page.name);//Tối ưu google cache
    } else {
      console.error('Page not found for module instance:', pageId);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  };

  return (
    <Box sx={{ height: '100%', width: 'calc(100% - 10px)', marginLeft: '10px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {selectedPageContent || selectedContent ? (
              <Box sx={{ p: 2, width: '100%', height: '100%', overflow: 'auto', alignItems: 'center' }}>
                {selectedPageContent ? (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: selectedPageContent }} />
                    <Divider sx={{ my: 2, backgroundColor: 'black' }} />
                    <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                      {selectedPageName}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1">{selectedContent}</Typography>
                    <Divider sx={{ my: 2, backgroundColor: 'black' }} />
                    <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                      {selectedContentName}
                    </Typography>
                  </>
                )}
              </Box>
            ) : null}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Chi tiết khóa học
          </Typography>
          {courseData.map(section => (
            <Box key={section.id} sx={{ mb: 2, border: '1px solid #ccc', overflow: 'hidden' }}>
              <Box
                onClick={() => toggleSection(section.id)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  padding: '8px 16px',
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <Typography variant="h6">
                  {section.name}
                </Typography>
                {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
              </Box>
              <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
                <List sx={{ padding: 0, overflowY: 'hidden' }}>
                  {section.modules.map(module => (
                    <Box key={module.id} sx={{ borderBottom: '1px solid #ccc' }}>
                      <ListItem
                        onClick={() => handleModuleClick(module)}
                        sx={{
                          padding: '8px 16px',
                          '&:hover': {
                            backgroundColor: 'grey.200',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <ListItemText primary={module.name} />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
});

export default CourseContent;
