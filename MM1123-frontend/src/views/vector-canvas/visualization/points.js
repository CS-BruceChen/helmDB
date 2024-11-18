import rawData from '@/data/TestSet_projection.json'

export function getPoints() {
    let points=[]
    for (let i = 0; i < rawData.length; i++) {
        let x = rawData[i]["3DProjection"][0][0];
        let y = rawData[i]["3DProjection"][0][1];
        let z = rawData[i]["3DProjection"][0][2];
        points.push([x,y,z])
    }

    // points组织成一个Float32Array
    let pointsArray = new Float32Array(rawData.length * 3);
    for (let i = 0; i < points.length; i++) {
        let x = rawData[i]["3DProjection"][0][0];
        let y = rawData[i]["3DProjection"][0][1];
        let z = rawData[i]["3DProjection"][0][2];
        pointsArray[i * 3] = x;
        pointsArray[i * 3 + 1] = y;
        pointsArray[i * 3 + 2] = z;
    }
    return pointsArray;    
}