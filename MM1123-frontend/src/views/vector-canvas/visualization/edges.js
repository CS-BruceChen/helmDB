import rawData from '@/data/MergedData_projection.json'
import adjList from '@/data/MergedData_adjList.json'
import ivAdjList from '@/data/MergedData_inverted_adjList.json'

export function getCitationOutEdges(resultIDs){
    let lines=[]
    let endPoints = [];
    let currLineNum = 0;
    for (let i = 0; i < resultIDs.length; i++){
        let startID = resultIDs[i];
        let endIDs = adjList[startID];
        // 如果endIDs是undefined，则跳过该节点
        if (endIDs === undefined) {
            continue;
        }
        for (let j = 0; j < endIDs.length; j++){
            let endID = endIDs[j];
            let endIndex = endID-1;
            let startIndex = startID-1;
            let startX = rawData[startIndex]["3DProjection"][0][0];
            let startY = rawData[startIndex]["3DProjection"][0][1];
            let startZ = rawData[startIndex]["3DProjection"][0][2];
            let endX = rawData[endIndex]["3DProjection"][0][0];
            let endY = rawData[endIndex]["3DProjection"][0][1];
            let endZ = rawData[endIndex]["3DProjection"][0][2];
            lines.push(startX,startY,startZ,endX,endY,endZ);
            endPoints.push(endX,endY,endZ);
            currLineNum++;
        }
    }
    let linesArray = new Float32Array(lines);
    let endPointsArray = new Float32Array(endPoints);
    return [linesArray,endPointsArray];
}

export function getCitationInEdges(resultIDs){
    let lines=[]
    let endPoints = [];
    let currLineNum = 0;
    for (let i = 0; i < resultIDs.length; i++){
        let startID = resultIDs[i];
        let endIDs = ivAdjList[startID];
        // 如果endIDs是undefined，则跳过该节点
        if (endIDs === undefined) {
            continue;
        }
        for (let j = 0; j < endIDs.length; j++){
            let endID = endIDs[j];
            let endIndex = endID-1;
            let startIndex = startID-1;
            let startX = rawData[startIndex]["3DProjection"][0][0];
            let startY = rawData[startIndex]["3DProjection"][0][1];
            let startZ = rawData[startIndex]["3DProjection"][0][2];
            let endX = rawData[endIndex]["3DProjection"][0][0];
            let endY = rawData[endIndex]["3DProjection"][0][1];
            let endZ = rawData[endIndex]["3DProjection"][0][2];
            lines.push(startX,startY,startZ,endX,endY,endZ);
            endPoints.push(endX,endY,endZ);
            currLineNum++;
        }
    }
    let linesArray = new Float32Array(lines);
    let endPointsArray = new Float32Array(endPoints);
    return [linesArray,endPointsArray];
}