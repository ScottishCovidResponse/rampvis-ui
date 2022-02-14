import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import MathJax from "react-mathjax";

const timeseriesFormula = `\\pmb{t} = \\{t_\\mathrm{1},t_\\mathrm{2},\\cdots,t_\\mathrm{n}\\}`;
const multiTimeseries = `\\pmb{T}_\\mathrm{d,c} =\\{\\pmb{t}_\\mathrm{d,c}^{(\\mathrm{1})},\\mathbf{t}_\\mathrm{d,c}^{(\\mathrm{2})},\\cdots,\\pmb{t}_\\mathrm{d,c}^{(n_\\mathrm{i})}\\}^\\top`;
const timeseriesMatrix = `\\mathrm{TSDB}_\\mathrm{n_\\mathrm{d} \\times n_\\mathrm{c}} = 
\\begin{pmatrix}
\\pmb{T}_\\mathrm{1,1}  & \\pmb{T}_\\mathrm{1,2}  & \\cdots & \\pmb{T}_\\mathrm{1,n_\\mathrm{c}}  \\\\
\\pmb{T}_\\mathrm{2,1}  & \\pmb{T}_\\mathrm{2,2}  & \\cdots & \\pmb{T}_\\mathrm{2,n_\\mathrm{c}} \\\\
\\vdots & \\ddots  & \\ddots & \\vdots \\\\
\\pmb{T}_\\mathrm{n_\\mathrm{d},1}  & \\cdots  & \\cdots & \\pmb{T}_\\mathrm{n_\\mathrm{d},n_\\mathrm{c}}
\\end{pmatrix}`;
const slicedMatrix = `\\mathrm{TSDF}_\\mathrm{n_\\mathrm{d} \\times n_\\mathrm{c}} = 
\\begin{pmatrix}
\\pmb{t}_\\mathrm{1,1}  & \\pmb{t}_\\mathrm{1,2}  & \\cdots & \\pmb{t}_\\mathrm{1,n_\\mathrm{c}}  \\\\
\\pmb{t}_\\mathrm{2,1}  & \\pmb{t}_\\mathrm{2,2}  & \\cdots & \\pmb{t}_\\mathrm{2,n_\\mathrm{c}} \\\\
\\vdots & \\ddots  & \\ddots & \\vdots \\\\
\\pmb{t}_\\mathrm{n_\\mathrm{d},1}  & \\cdots  & \\cdots & \\pmb{t}_\\mathrm{n_\\mathrm{d},n_\\mathrm{c}}
\\end{pmatrix}`;
const distanceScore = `d(\\pmb{x},\\pmb{y}) = a`;
const similarityScore = `s(\\pmb{x},\\pmb{y}) = 1 - d(\\pmb{x},\\pmb{y})`;
const distanceMeasureTable = `
\\begin{array}{|c|c|}
\\hline
\\hline
\\
\\text{} & \\text{Equation}  
\\\\
\\hline
\\\\
\\text{Minkowski} & d_\\mathrm{p} : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_p = \\Big(\\sum_{i=1}^n|x_i-y_i|^p\\Big)^\\frac{1}{p}
\\\\
\\text{Manhattan} & d_\\mathrm{1} : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_1 = \\sum_{i=1}^n |x_i - y_i|
\\\\
\\text{Euclidean} & d_2  :  (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2} 
\\\\
\\text{Sum of Squared} &d_\\mathrm{SSD} : (\\pmb{x},\\pmb{y}) \\longmapsto d_2^2 = ||\\pmb{x}-\\pmb{y}||_2^2 = \\sum_{i=1}^n (x_i - y_i)^2
\\\\
\\text{Mean Squared} & d_\\mathrm{MSE} : (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{d_\\mathrm{SSD}}{n} = \\frac{||\\pmb{x}-\\pmb{y}||_2^2}{n} = \\frac{1}{n}\\sum_{i=1}^n (x_i - y_i)^2
\\\\
\\text{Chebyshev} &   d_\\infty : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_\\infty = \\lim_{p \\rightarrow \\infty}\\Big(\\sum_{i=1}^n (x_i - y_i)^p\\Big)^{\\frac{1}{p}}
\\\\
\\text{Canberra} & d_\\mathrm{CAD} : (\\pmb{x},\\pmb{y}) \\longmapsto \\sum_{i=1}^n \\frac{|x_i-y_i|}{|x_i|+|y_i|}
\\\\
\\text{Bray-Curtis} & d_\\mathrm{BC} : (\\pmb{x},\\pmb{y}) \\longmapsto  \\frac{\\sum_{i=1}^n|x_i-y_i|}{\\sum_{i=1}^n|x_i+y_i|}
\\\\
\\\\
\\hline
\\hline
\\end{array}`;
const compressionMeasureTable = `
\\begin{array}{|c|c|}
\\hline
\\hline
\\
\\text{} & \\text{Equation}  
\\\\
\\hline
\\\\
\\text{Pearson's Correlation} & s_\\mathrm{pr} :  (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{\\sum_{i=1}^{n}(x_i - \\mu_x)\\sum_{i=1}^{n}(y_i - \\mu_y)}{\\sqrt{\\sum_{i=1}^{n}(x_i-\\mu_x)^2\\sum_{i=1}^{n}(y_i-\\mu_y)^2}}
\\\\
\\text{Cosine Similarity} & s_\\mathrm{cos} : (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{\\big< \\pmb{x},\\pmb{y} \\big>}{||\\pmb{x}||_2||\\pmb{y}||_2} = \\frac{\\sum_{i=1}^n x_iy_i}{\\sqrt{\\sum_{i=1}^{n}x_i^2}\\sqrt{\\sum_{i=1}^{n}y_i^2}} 
\\\\
\\\\
\\hline
\\hline
\\end{array}`;

function InfoPopUp(props) {
  return (
    <div className={props.className}>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={props.open}
      >
        ?
      </Button>

      <Dialog
        fullScreen
        open={props.state}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Time-period Search Info Screen
        </DialogTitle>
        <DialogContent>
          <MathJax.Provider>
            <div>
              <h2>Time-series similarity matching</h2>
              <p>
                {" "}
                A time-series is an ordered sequence which represents
                observations that changes over time [1]. It is represented as{" "}
                <MathJax.Node inline formula={timeseriesFormula} /> where{" "}
                <MathJax.Node inline formula={`\\mathrm{n}`} /> is the last
                element and length of the time-series object. For the
                covid-data, a time-series database is created. For one country,
                there are several indicators introducing multi-dimensional data
                (cases, deaths, icu admissions, tests). For a particular date
                and country, multi-dimensional time-series data is represented
                as <MathJax.Node inline formula={multiTimeseries} /> where{" "}
                <MathJax.Node inline formula={`\\mathrm{d}`} /> is date,{" "}
                <MathJax.Node inline formula={`\\mathrm{c}`} /> is country and{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{i}`} />
                is the number of indicators. The time-series database is
                structured as follows:
                <MathJax.Node formula={timeseriesMatrix} />
                where{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{d}`} /> is
                the number of dates and{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{c}`} /> is
                the number of countries.
              </p>
              <p>
                The tool's aim is to rank and display statistically closest
                temporal movements given a query time-series. This is solved by
                defining a similarity or distance measure between the
                time-series object to estimate how close the temporal movements
                are [2]. The distance and similarity score between two
                time-series objects x and y are defined as [2]:
                <MathJax.Node formula={distanceScore} />
                <MathJax.Node formula={similarityScore} /> where{" "}
                <MathJax.Node inline formula={`a`} /> is scalar. There are two
                frameworks on time-series matching which are [3] whole series
                and subsequent matching. The former uses the whole length of the
                time-series and computes similarity between all objects in the
                database. The latter takes a shorter time-series as the query
                input and finds matches from longer time-series. In this tool,
                whole time-series matching is used.
              </p>
              <p>
                Given a query time-series,(ex: last month's biweekly cases per
                million for France) the system creates a dataframe which gathers
                all available countries data on the given indicator. Then using
                a window function, a new dataframe generated storing
                same-lengthed time-series in each cell using the query length.
                The generated dataframe TSDF can be represented as follows:
                <MathJax.Node formula={slicedMatrix} />
                The column values are country names and the indexes correspond
                to the last date of the corresponding time-series. A sample
                dataframe is shown below:
                <div style={{ textAlign: "center" }}>
                  <img height={400} src="/static/timeseries-sim/tsdf.png" />
                </div>
                Using the similarity measure chosen by the user, the similarity
                between query and each cell are calculated to create a new
                dataframe in same dimensions but with scalar distance scores in
                each cell. This dataframe are then vectorized and most similar
                time-series are sorted and sent back to visualize.
              </p>
              <h2>Similarity measures</h2>
              <p>
                Distance measures can be categorized in numerous ways. Some
                algorithms favors the similarity in the linear relationship of
                the curves [4], others favor the similarity in time by using
                one-to-one point alignment [5]. For longer time-series, there
                are model-based (ARIMA) [6] and feature based (DFT) [7]
                algorithms which fit the time-series into a parametric model or
                extract features using dimension reduction methods respectively.
                The distance measures available tool are divided into two
                categories (lock-step and elastic measures) by how the points
                from two time-series objects can align. Distance measures can be
                categorized in numerous ways. Some algorithms favors the
                similarity in the linear relationship of the curves [29], others
                favor the similarity in time by using one-to-one point alignment
                [5]. For longer time-series, there are model-based (ARIMA) [6]
                and feature based (DFT) [7] algorithms which fit the time-series
                into a parametric model or extract features using dimension
                reduction methods respectively. The distance measures availables
                are divided into two categories (lock-step and elastic measures)
                by how the points from two time-series objects can align.
              </p>
              <h3>Lock-step measures</h3>
              <p>
                Lock step measures compare the points at the exact same temporal
                position [8]. The most used lock step measure to compare
                time-series is the Minkowski distance, also known as Lp norm
                [8]. For p = 1, the distance measure is called Manhattan or
                city-block distance. This uses the absolute value of the
                difference between time-points [9]. For p = 2, Euclidean
                distance is obtained [9]. This measure is the most common method
                used for one dimensional applications, but for higher
                dimensions, Manhattan distance is more preferable [10]. Both
                distance measures are sensitive to noises [9]. If there is a
                high amplitude noise in the signal, all of the score is
                dominated by this point as the distance measures sum up the
                difference values of corresponding points. This effect increases
                naturally as p is increased. For the limit p → ∞, Chebyshev
                distance is obtained which takes the maximum distance between
                all temporal pairs [9].
              </p>
              <MathJax.Node formula={distanceMeasureTable} />
              <p>
                Sum of Squared distance is the squared version of Euclidean
                distance. Due to disappearance of square root in the calculation
                of distance score, this method is faster when computing. Mean
                squared distance is also derived from the Euclidean distance by
                squaring and dividing by the number elements. The ranking of
                distance scores are done using same length
                time-series;therefore, there is no difference on results created
                by Euclidean, squared, mean squared distance. Canberra and
                Bray-Curtis distance measures are modifications of Manhattan
                distance by weighting the difference by the values of the
                temporal points [11]. The main problem using those metrics is
                that if the compared points are both close to the origin, the
                distance score gets significantly large due to the denominator.
                Secondly, all the time-series compared in the system is
                non-negative. Therefore, the results obtained from these
                measures will be the same.
              </p>
              <p>
                The second category in the lock-step measures is the
                compression-based family. The idea and the name comes from the
                notion of the algorithms such that it measures how much
                information or compression can be obtained by knowing one of the
                compared time-series [12]. These are mainly used in text and
                media mining [13]. Pearson's correlation distance uses the
                co-variance between the time-series [13]. If only correlation
                index is used, the output ranges from -1 to 1 with 1 indicating
                that there is perfect positive linear relationship between
                time-series. A correlation of 0 means that two series are
                independent. To obtain a distance measure, the result is
                subtracted from 1, resulting a new range from 0 to 2. Cosine
                distance evaluates the cosine angle between the temporal points
                [12]. It's a special case of the Pearson's correlation distance
                when the mean of both time-series is equal to zero.
              </p>
              <MathJax.Node formula={compressionMeasureTable} />
              <p>
                Compression-based metrics favor the shape of the curve rather
                than the amplitude and are all invariant to uniform amplitude
                scaling and offset. Therefore, if the amplitudes of the curves
                are important in the ranking system, they would behave poorly.
              </p>
              <h3>Elastic measures</h3>
              <p>
                Elastic measures are more complex algorithms that are able to
                work with time-series with different length and sampling rate
                [8]. Unlike the lock-step measure approach, they allow elastic
                temporal alignments in the time-series. Dynamic time warping
                (DTW) and longest common sub-sequence (LCS) algorithms are
                available in the tool. The pseucode for the algorithms are shown
                below. Euclidean distance is chosen as the metric to be used in
                both elastic measures.
                <div style={{ display: "flex" }}>
                  <div style={{ textAlign: "center" }}>
                    <img height={400} src="/static/timeseries-sim/dtw.png" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <img height={500} src="/static/timeseries-sim/lcs.png" />
                  </div>
                </div>
              </p>
              <p>
                DTW algorithm calculates the perfect alignment between the
                time-series objects. It takes two time-series objects and
                transforms their time alignment into a warped time shape by
                using repeated/removed temporal points [14]. It allows for
                one-to-many and many-to-one matching between temporal points
                [14]. This is done by generating a distance matrix from time
                series and finding the distance path corresponding to minimal
                cost from the origin to the end-point [14]. For two time-series
                x and y with lengths n and m respectively, the algorithm has a
                time complexity of O(nm) which is significant as all the
                shape-based features have a complexity of O(n) and all the
                compression-based O(3n).
              </p>
              One disadvantage of the DTW algorithm is due to the matching of
              all points. As shown below, the outliers and noise in the
              time-series effect the resulting distance score. LCS does not
              suffer from this problem as the algorithm does not match all the
              points but looks for similar sub-sequences inside the compared
              time-series [15]. Secondly it has two inputs for adjusting both
              the distance threshold and the maximum number of allowed shift for
              alignment which are ε and δ respectively [16]. If the objects in
              the time-series database are close to each other, a small value of
              ε causes reduced extracted features which is infeasible for
              ranking. As the value of ε tends to infinity, the paths calculated
              by the algorithm become the same as that calculated by the
              lock-step measures.
              <div style={{ textAlign: "center" }}>
                <img height={800} src="/static/timeseries-sim/alignment.png" />
              </div>
              <hr />
              <p>
                [1] Dimitrios Gunopulos and Gautam Das. Time series similarity
                measures and time series indexing. In Proceedings of the 2001
                ACM SIGMOD International Conference on Management of Data, page
                624. Association for Computing Machinery, 2001. URL
                https://doi.org/10.1145/375663. 375808.
              </p>
              <p>
                [2] Guojun Gan, Chaoqun Ma, and Jianhong Wu. Data clustering -
                theory, algorithms, and applications., chapter 6.6, pages
                87–100. SIAM, 2007.
              </p>
              <p>
                [3] Carmelo Cassisi, Placido Montalto, Marco Aliotta, Andrea
                Cannata, and Alfredo Pulvirenti. Similarity Measures and
                Dimensionality Reduction Techniques for Time Series Data Mining,
                chapter 3. 09 2012. ISBN 978-953-51-0748-4. doi: 10.5772/49941.
              </p>
              <p>
                [4] Rongheng Lin, Budan Wu, and Yun Su. An adaptive weighted
                pearson similarity measurement method for load curve clustering.
                Energies, 11(9), 2018. ISSN 1996-1073. doi: 10.3390/en11092466.
                URL https://www.mdpi.com/1996-1073/11/9/2466.
              </p>
              <p>
                [5] Joan Serra and Josep Ll. Arcos. An empirical evaluation of
                similarity measures for time series classification. 67:305-314,
                September 2014. ISSN 0950-7051. doi:
                10.1016/j.knosys.2014.04.035.
              </p>
              <p>
                [6] Yang Yu and Dingsheng Wang. Similarity study of hydrological
                time series based on data mining. In Big Data Analytics for
                Cyber-Physical System in Smart City, pages 1049–1055. Springer
                Singapore, 2021. ISBN 978-981-33-4572-0.
              </p>
              <p>
                [7] Miaomiao Zhang and Dechang Pi. A new time series
                representation model and corresponding similarity measure for
                fast and accurate similarity detection. IEEE Access,
                5:24503-24519, 2017. doi: 10.1109/ACCESS.2017.2764633.
              </p>
              <p>
                [8] Xiaoyue Wang, Hui Ding, Goce Trajcevski, Peter Scheuermann,
                and Eamonn Keogh. Experimental comparison of representation
                methods and distance measures for time series data. Data Mining
                and Knowledge Discovery, 26, 12 2010. doi:
                10.1007/s10618-012-0250-5.
              </p>
              <p>
                [9] Ali Seyed Shirkhorshidi, Saeed Aghabozorgi, and Teh Ying
                Wah. A comparison study on similarity and dissimilarity measures
                in clustering continuous data. PLOS ONE, 10(12):1–20, 12 2015.
                doi: 10.1371/journal.pone.0144059. URL
                https://doi.org/10.1371/journal.pone.0144059.
              </p>
              <p>
                [10] Charu Aggarwal, Alexander Hinneburg, and Daniel Keim. On
                the surprising behavior of distance metric in high-dimensional
                space. ICDT 200, 8th International Conference, London, UK,
                January 4 - 6, 2001, 02 2002.
              </p>
              <p>
                [11] Sung-Hyuk Cha. Comprehensive survey on distance/similarity
                measures between probability density functions. Int. J. Math.
                Model. Meth. Appl. Sci., 1, 01 2007.
              </p>
              <p>
                [12] Eamonn Keogh, Stefano Lonardi, Chotirat Ratanamahatana, Li
                Wei, Sang-Hee Lee, and John Handley. Compression-based data
                mining of sequential data. Data Mining and Knowledge Discovery,
                14:99-129, 02 2007. doi: 10.1007/s10618-006-0049-3.
              </p>
              <p>
                [13] David Pereira Coutinho and Mário A. T. Figueiredo. Text
                classification using compression-based dissimilarity measures.
                International Journal of Pattern Recognition and Artificial
                Intelligence, 29 (05):1553004, 2015. doi:
                10.1142/S0218001415530043.
              </p>
              <p>
                [14] Meinard Müller. Dynamic time warping. Information Retrieval
                for Music and Motion, 2:69–84, 01 2007. doi:
                10.1007/978-3-540-74048-3_4.
              </p>
              <p>
                [15] Tomasz Górecki. Classification of time series using
                combination of dtw and lcss dissimilarity measures.
                Communications in Statistics - Simulation and Computation,
                47(1):263–276, 2018. doi: 10.1080/03610918.2017.1280829.
              </p>
              <p>
                [16] Gholamreza Soleimany and Masoud Abessi. A new similarity
                measure for time series data mining based on longest common
                subsequence. American Journal of Data Mining and Knowledge
                Discovery, 4:32, 01 2019. doi: 10.11648/j.ajdmkd.20190401.16.
              </p>
            </div>
          </MathJax.Provider>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InfoPopUp;
