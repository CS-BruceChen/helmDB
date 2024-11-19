su wym -c "
export PATH=$PATH:/home/wym/pigz-2.7;
export LD_LIBRARY_PATH=/data1/lzp/opengauss/opengauss_code/dest/lib:$LD_LIBRARY_PATH;
export PATH=$PATH:/home/wym/HELMDB_dest/bin;
/home/wym/miniconda3/envs/MM_DataPrepare/bin/python /home/wym/csbog/MM1123/MM1123-backend/server.py
"