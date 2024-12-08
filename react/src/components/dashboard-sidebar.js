import { useEffect, useState, createContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { User as UserIcon } from '../icons/user';
import { Users as UsersIcon } from '../icons/users';
import { NavItem } from './nav-item';
import LogoutIcon from '@mui/icons-material/Logout';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AddIcon from '@mui/icons-material/Add';
var qry;
if (typeof window !== 'undefined') {
  qry = window.location.search
}


import { NavButton } from './nav-button';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
const queryString = require('query-string');




const accountItems = [
  {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    title: 'Account'
  },
  {
    href: '/news',
    icon: (<NewReleasesIcon fontSize="small" />),
    title: 'News'
  },

];


export const DashboardSidebar = (props) => {
  const router = useRouter()
  const[pages, setPages] = useState([])
  const [current, setCurrent]= useState("")
  useEffect(() => {
    fetch('https://veebster.tk/api/user/session', {
      credentials: "include",
    }).then(res => res.json()).then((data)=>{
      if(data.uid){
        fetchPages();
      }
      else{
        if (typeof window !== 'undefined') {
          // do your stuff with sessionStorage
          sessionStorage.setItem("notification", "You have to be logged in to access this route!")
          return router.push("/login")
      }
      }
    })
  }, []);


  const[navItems, setNavItems] = useState([

  ])

  const fetchPages = () =>{

  fetch('https://veebster.tk/api/page/list', {
    credentials: "include",
  }).then(res => res.json()).then((data)=>{
      if(data.ok){
        if(data.pages.length === 0){
        setNavItems([
          {
            href: '/newpage',
            icon: (<AddIcon fontSize="small" />),
            title: 'Create Page'
          }
        ])
        }
        else{
          sessionStorage.setItem("pagesList", JSON.stringify(data.pages))
          setPages(data.pages);
          let queryPage = queryString.parse(window.location.search).page

          if(queryPage){
              for(var i = 0;i< data.pages.length;i++){
                  if(data.pages[i].id == queryPage){
                    setNavItems([
                      {
                        href: '/dash' ,
                        icon: (<ChartBarIcon fontSize="small" />),
                        title: 'Dashboard',
                        qry
                      },
                      {
                        href: '/sessions',
                        icon: (<UsersIcon fontSize="small" />),
                        title: 'Sessions',
                        qry
                      },
                      {
                        href: '/geographics',
                        icon: (<AddLocationAltIcon fontSize="small" />),
                        title: 'Geographics',
                        qry
                      },
                      {
                        href: '/tasks',
                        icon: (<PlaylistAddIcon fontSize="small" />),
                        title: 'Tasks',
                        qry
                      },
                      {
                        href: '/settings',
                        icon: (<CogIcon fontSize="small" />),
                        title: 'Settings',
                        qry
                      },
                    ])
                    setCurrent(data.pages[i].domain)
                    return
                  }
              }
                window.location.href = "/news"
          }
          else{

            if(["/account", "/news", "/account", "/newpage"].indexOf(window.location.pathname) === -1){
              window.location.pathname = "/news"
            }

            let links = [];
            data.pages.map((shard)=>{
              return {
                href: '/dash',
                qry: "?page="+ shard.id,
                icon: (<ChartBarIcon fontSize='small'/>),
                title: shard.domain
              }
            }) 



            links.push({
              href: '/newpage',
              icon: (<AddIcon fontSize="small" />),
              title: 'New Page'
            })

            
            return setNavItems(links)
            
          }
        }
      }
      else{

      }

  })
  }

  



  const { open, onClose } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  // useEffect(
  //   () => {
  //     if (!router.isReady) {
  //       return;
  //     }

  //     if (open) {
  //       onClose?.();
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [router.asPath]
  // );


 




  function pageSelectorChange(event){
    const {
      target: { value },
    } = event;
    if(value == "new"){
      return router.push("/newpage")
    }
    for(var i = 0;i<pages.length;i++){
      if(pages[i].domain == value){
        window.location.href = "/dash?page=" + pages[i].id
      }
    }
  }


  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
              

              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>




    





            
            <Select
                onChange={pageSelectorChange}
                value = {current || "Select"}
                sx={{
                color: "#fff",
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '1px',
                borderRadius: 1,
                
              }}
            >
                  <MenuItem disabled value="Select">
                    <em>Select page</em>
                  </MenuItem>
                  {pages.map((shard)=>(
                    <MenuItem
                      key={shard.domain}
                      value={shard.domain}
                    >
                      {shard.domain}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">
                     <AddIcon/>New page
                  </MenuItem>



            </Select>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              query={item.qry}
            />
          ))}
          <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
          {accountItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
          <div  onClick={()=>{
            fetch("https://veebster.tk/api/user/logout", {credentials:"include"}).then(res => res.json()).then((data)=>{
              if (typeof window !== "undefined") {
                  if(data.ok){
                  window.sessionStorage.setItem("notification", "You are successfully logged out!")
                  window.location.href = "/login"
                  }
                  else{
                    window.sessionStorage.setItem("notification", data.err)
                    window.location.href = "/login"
                  }
                }
                
            })
          }}>
            <NavButton 
              key="logout"
              icon = {<LogoutIcon style={{ color: 'red' }}/>}
              title="Log Out"
              
              />
              </div>
        </Box>

      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
