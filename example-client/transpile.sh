cd ./node_modules
rm -rf @hoobs/sdk-transpiled
mkdir -p @hoobs/sdk-transpiled
cp -r @hoobs/sdk/lib @hoobs/sdk-transpiled/lib
cp -r @hoobs/sdk/node_modules @hoobs/sdk-transpiled/node_modules
cp @hoobs/sdk/package.json @hoobs/sdk-transpiled/package.json 
cp @hoobs/sdk/yarn.lock @hoobs/sdk-transpiled/yarn.lock
.bin/babel @hoobs/sdk/lib --out-dir @hoobs/sdk-transpiled/lib/ --plugins=@babel/plugin-transform-modules-commonjs