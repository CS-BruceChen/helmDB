import rawData from '@/data/TestSet_projection.json'
import rawEdge from '@/data/edge.json'

export function getAllEdges() {
    let linesArray = new Float32Array(rawEdge.length * 6);

    for (let i = 0; i < rawEdge.length; i++) {
        let startID = rawEdge[i][0];
        let startIndex = startID-1;
        let endID = rawEdge[i][1];
        let endIndex = endID-1;

        let startX = rawData[startIndex]["3DProjection"][0][0];
        let startY = rawData[startIndex]["3DProjection"][0][1];
        let startZ = rawData[startIndex]["3DProjection"][0][2];

        let endX = rawData[endIndex]["3DProjection"][0][0];
        let endY = rawData[endIndex]["3DProjection"][0][1];
        let endZ = rawData[endIndex]["3DProjection"][0][2];

        linesArray[i * 6] = startX;
        linesArray[i * 6 + 1] = startY;
        linesArray[i * 6 + 2] = startZ;
        linesArray[i * 6 + 3] = endX;
        linesArray[i * 6 + 4] = endY;
        linesArray[i * 6 + 5] = endZ;
    }

    return linesArray;
}

export function getEdge(startID,endID){
    let linesArray = new Float32Array(6);
    let startIndex = startID-1;
    let endIndex = endID-1;
    let startX = rawData[startIndex]["3DProjection"][0][0];
    let startY = rawData[startIndex]["3DProjection"][0][1];
    let startZ = rawData[startIndex]["3DProjection"][0][2];
    let endX = rawData[endIndex]["3DProjection"][0][0];
    let endY = rawData[endIndex]["3DProjection"][0][1];
    let endZ = rawData[endIndex]["3DProjection"][0][2];
    linesArray[0] = startX;
    linesArray[1] = startY;
    linesArray[2] = startZ;
    linesArray[3] = endX;
    linesArray[4] = endY;
    linesArray[5] = endZ;
    return linesArray;
}