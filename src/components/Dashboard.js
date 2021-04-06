import React, { useState, useEffect, Component } from "react";
import { gql, useLazyQuery } from '@apollo/client'
import { navigate } from "gatsby";
import { isLoggedIn, logout, getAcsToken } from "../utils/auth";

import ControlPanel from "./dashboard/ControlPanel";
import ClassSelector from "./dashboard/ClassSelector";

import Home from "./Home";
import Students from "./Students";
import TreasureBox from "./TreasureBox";

import dashboardStyles from "./dashboard.module.css";

const Dashboard = props =>{

  const [show, setShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(async () =>{
    const userLoggedIn = await isLoggedIn()
    if(!userLoggedIn){
      return navigate('/')
    } else{
      setShow(true)
    }
  }, [])

  const GET_TEACHER_INFO = gql`
    query getTeacherInfo{
      teacher{
        firstName
        lastName
        email
        classes{
            classId
            className
        }
      }
    }
  `

  const [loadTeacherInfo, { called, loading, data, error }] = useLazyQuery(GET_TEACHER_INFO, 
    {
      onCompleted({ teacher }){
        if(teacher && teacher.classes.length > 0){
          setClasses(teacher.classes)
          setSelectedClassId(teacher.classes[0].classId)
        }
      }
    }
  )

  const onTabSelectHandler = (tabName) =>{
    setSelectedTab(tabName)
  }

  const onSelectClassHandler = (e) =>{
    const selectedClassName = e.target.value
    const selectedClass = classes.find(cls =>{
      return cls.className = selectedClassName
    })
    setSelectedClassId(selectedClass.classId)
  }

  if(!called && show){
    loadTeacherInfo()
    return null
  }

  if(loading){
    return (
      <div>
        <h1>...Loading...</h1>
      </div>
    )
  }

  // if(error){

  // }

  if(called && !loading){

    let tabComponent
    switch(selectedTab){
      case 'Students':
        tabComponent = <Students />
      case 'TreasureBox':
        tabComponent = <TreasureBox />
      case 'Settings':
        tabComponent = <TreasureBox />
      default:
        tabComponent = <Home />
    }

    return (
      <div>
        <h1>This is the dashboard page!</h1>

        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            logout(() => navigate("/"));
          }}
        >
          Log Out!
        </a>

        <ControlPanel
          onSelectHandler={onTabSelectHandler}
          selectedComponent={selectedTab}
        />

        <ClassSelector
          onSelect={onSelectClassHandler}
          classes={classes}
        />

        <h1>Below is the selected tab</h1>
        {/* {}

        }

        {this.state.selectedClass ? (
          <h2>{this.state.selectedClass} is selected</h2>
        ) : (
          <h2>You don't have any classes!</h2>
        )}

        {selectedComponent} */}
      </div>
    )
  }

  return null
}

export default Dashboard;
