import React, { useState } from "react";
import './Todo.css';
import { gql ,useQuery,useMutation} from "@apollo/client";
import { useEffect } from "react";

const MY_QUERY = gql`
query MyQuery {
  user {
    user_id
    user_name
    user_city
  }
}`;

const INSERT_USER = gql`
mutation InsertUser ($userName: String!, $userCity: String!) {
    insert_user_one(object: { user_name: $userName, user_city: $userCity }) {
      user_name,
      user_city
    }
}
`;


const DELETE_USER=gql`
mutation DeleteUser($userId:Int!){
  delete_user(where: {user_id: {_eq: $userId}}) {
    affected_rows
  }
}
`

const UPDATE_USER=gql`
mutation UpdateUser($userName:String!,$userCity:String!,$userId:Int!)
{
  update_user_by_pk(pk_columns: {user_id: $userId}, _set: {user_city: $userCity, user_name: $userName}) {
    user_city
    user_id
    user_name
  }
}
`


const Todo = (props) => {

    const [userid,setUserid]=useState(0)

    const [userData,setUserData]=useState([]);

    const [name,setName]=useState("")

    const [city,setCity]=useState("")

    const { loading, error, data } = useQuery(MY_QUERY);


    useEffect(() => {
        if (!loading && !error) {
          setUserData(data?.user || []);
        }
      }, [loading,data,error])



      const [insertUser] = useMutation(INSERT_USER, {
        onCompleted: (data) => {
          
            setName("");
            setCity("");

        },
    
        refetchQueries: [{ query: MY_QUERY }],
      });


      const [DeleteUser]=useMutation(DELETE_USER,{
        onCompleted:(data)=>{
          console.log(data)
          setUserid(0)
          setCity("")
          setName("")
          
        },

        refetchQueries: [{ query: MY_QUERY }],

      })


      const [UpdateUser]=useMutation(UPDATE_USER,{
        onCompleted:(data)=>{
          setName("");
          setCity("");
          setUserid(0)

        },
        refetchQueries: [{ query: MY_QUERY }],

      })
    
      const OnRegistered=()=>{

        if(userid)
        {
          if(name.length===0 || city.length===0)
          {
            return
          }

          else
          {
            UpdateUser({variables:{userId:userid,userCity:city,userName:name}})

          }
          

        }
        else
        {
          if(name.length===0 || city.length===0)
          {
            return
          }
        else
        {
          insertUser({ variables: { userName: name, userCity: city } });

        }

        }
      }
    

      const deleteuser=(userid)=>{ 
        DeleteUser({variables:{userId:userid}})
        console.log(userid)

      }


      const updateUser=(data)=>{
        setName(data.user_name);
        setCity(data.user_city)
        setUserid(data.user_id)
      }



      
    return (
        <div className="main">
            <div className="mainfirst">
            <div className="first">
                <div className="inputfield"><span>NAME</span><input  onChange={(e)=>setName(e.target.value)} value={name}/></div>
                <div  className="inputfield"><span>PLACE</span><input onChange={(e)=>setCity(e.target.value)} value={city}/></div>
                <div className="button">
                <button onClick={OnRegistered}>{userid?"UPDATE":"ADD"}</button>
                </div>
                
            </div>  
            <div className="second">
                {
                    userData.map(data=>{
                        return(
                            <table>
                                <tr className="tablerow" key={data.user_id}>
                                    <td>{data.user_name}</td>
                                    <td>{data.user_city}</td>
                                    <td><button style={{backgroundColor:"black"}} onClick={()=>updateUser(data)}>EDIT</button></td>
                                    <td><button style={{backgroundColor:"red"}} onClick={()=>deleteuser(data.user_id)}>DELETE</button></td>
                                </tr>
                            </table>
                        )
                    })
                }
            </div>
            </div>
        </div>
    )
}

export default Todo;
