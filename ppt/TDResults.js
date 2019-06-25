import React,{Component} from "react";
import { Table } from 'antd';
import ForceGraph3D from '3d-force-graph';

/* const columns = [{
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID',
}, {
    title: 'C1',
    dataIndex: 'C1',
    key: 'C1',
}, {
    title: 'C2',
    dataIndex: 'C2',
    key: 'C2',
}
]; */

const columns = [{
    title: '用户编号',
    dataIndex: 'id',
    key: 'id',
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
}, {
    title: '生日',
    dataIndex: 'birthday',
    key: 'birthday',
}, {
    title: '信用评级',
    dataIndex: 'risk_level',
    key: 'risk_level',
}, {
    title: '评定结果',
    dataIndex:'center_type',
    key:'center_type'
}
];

const dataSource = [{
    key: '1',
    ID: 'TEST1',
    C1: 1,
    C2: 'BASIC'
}, {
    key: '2',
    ID: 'TEST2',
    C1: 2,
    C2: 'CURVED'
},{
    key: '3',
        ID: 'TEST3',
        C1: 3,
        C2: 'CURVED'
}];

let savedLinks = [];
let savedId = [];
let Graph = null;

export default class TDResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            id: 0,
            nodeDisplay: 'none',
            linkDisplay: 'none',
            nodeId: '',
            nodeName: '',
            nodeSex: '',
            nodeBirthday: '',
            nodeRiskLevel: '',
            linkCount: '',
            linkAmount: '',
        };
        this.myRef = React.createRef();
        this.click = this.click.bind(this);
        this.setDataSource = this.setDataSource.bind(this);
    }

    componentWillMount(){
        //this.setDataSource(dataSource);
    }

    componentDidMount(){
        Graph = ForceGraph3D({controlType: 'trackball'})(this.myRef.current)
            .width(800)
            .height(800)
            .graphData({
                nodes:[],
                links:[]
            })
            .backgroundColor('white')
            .showNavInfo(false)
            .nodeId('id')
            .nodeLabel('name')
            .nodeColor((node)=>
            {
                return node.id===this.state.id?'#ff3643': (savedId.includes(node.id)?'#1DA57A':'#283dff')
            })
            .linkColor(()=>'#080707')
            .nodeResolution(8)
            .numDimensions(3)
            .linkCurvature('curvature')
            .linkCurveRotation('rotation')
            .linkDirectionalArrowLength(2)
            .linkDirectionalArrowRelPos(0.4)
            .linkLabel('val')
            //.linkWidth(1)
            .linkOpacity(0.5)
            .onNodeClick(node => {
                savedId.push(node.id);
                let content = {id:node.id};
                fetch("http://192.168.0.109:8080/graph/getSusCaseById",{
                    method: 'post',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams(content).toString(),
                    //JSON.stringify(content)//body:content.toString()
                    //new URLSearchParams([["cityCode", '110111']]).toString()
                }).then(response => response.json())
                    .then(data => {
                        {
                         console.log(data);
                         let gData={
                             nodes:data.Node,
                             links:data.Relationship
                         };
                            Graph.graphData(gData);
                        }
                    })
                    .catch(error => console.log('error is', error));
                //Aim at node from outside it
               const distance = 200;
               const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
              Graph.cameraPosition(
                  { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                  node, // lookAt ({ x, y, z })
                  4000  // ms transition duration
                );      
           })
            .onNodeRightClick(node => {
                let { nodes, links } = Graph.graphData();
                nodes = nodes.filter(n => n.id !== node.id); // Remove node right-clicked
                links = links.filter(l => l.source !== node && l.target !== node); // Remove links attached to node
                Graph.graphData({ nodes, links });
            })
            .onLinkClick(link => {
                savedLinks.push(link);
                Graph.linkColor(oldLink => {
                    return savedLinks.includes(oldLink)?'#ff3643':'#080707'
                })
                    // Graph.linkWidth(llink => {return llink === link ? 1 : 0})
                   // .linkColor(llink => {return llink === link ? '#ff3643' : '#080707'})
                }
            )
            .onNodeHover(node =>{
                if(node !== null){
                    this.setState(
                        {
                            nodeDisplay:'block',
                            linkDisplay:'none',
                            nodeId: node.id,
                            nodeName: node.name,
                            nodeSex: node.sex,
                            nodeBirthday: node.birthday,
                            nodeRiskLevel: node.risk_level,
                        } 
                    )
                }
            })
            .onLinkHover(link =>{
                if(link !== null){
                    this.setState(
                        {
                            nodeDisplay:'none',
                            linkDisplay:'block',
                            linkCount: link.count,
                            linkAmount: link.amount,    
                        } 
                    )
                }
            })
            
   
    }

    click(ID){
                //alert(ID);
                savedId = [];
                savedLinks = [];
                let content = {id:ID};
                this.setState(content);
                fetch("http://192.168.0.109:8080/graph/getSusCaseById",{
                    method: 'post',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams(content).toString(),
                    //JSON.stringify(content)//body:content.toString()
                    //new URLSearchParams([["cityCode", '110111']]).toString()
                }).then(response => response.json())
                    .then(data => {
                        {
                         console.log(data);
                         let gData={
                             nodes:data.Node,
                             links:data.Relationship
                         };
                            Graph.graphData(gData);
                        }
                    })
                    .catch(error => console.log('error is', error));
      
            }

        setDataSource(dataSource){
            this.setState({
                dataSource: dataSource
            })
        }
                

    render(){
        return(
           <div className="tdResults">
                <div className="tdTable">
                    <Table dataSource={this.state.dataSource} columns={columns} rowKey="id"
                       bordered={true} style={{ margin: '26px 26px', 
                       width:'1000px', backgroundColor:'white' }}
                       onRow={(record) => {
                           return {
                               onClick: (event) => {this.click(record.id)},       // 点击行
                           };
                       }}
                     />
                </div>
                <div className="graph">
                    <div className="visual" ref={this.myRef} />
                    <div className="note" style={{float: "left",height: 805,width: 250,textalign: "center",padding: 26,fontsize:20}}>
                        <div style={{display: 'block'}}> 
                        {/* this.state.nodeDisplay */}
                            <p><b>id: {this.state.nodeId}</b></p>
                            <p><b>姓名：{this.state.nodeName}</b></p>
                            <p><b>性别：{this.state.nodeSex}</b></p>
                            <p><b>生日：{this.state.nodeBirthday}</b></p>
                            <p><b>信用评级：{this.state.nodeRiskLevel}</b></p>
                        </div>
                        <div style={{display:this.state.linkDisplay}}>
                            <p><b>交易次数: {this.state.linkCount}</b></p>
                            <p><b>交易金额：￥{this.state.linkAmount}</b></p>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}